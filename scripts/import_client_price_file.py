#!/usr/bin/env python3
"""Add the client's latest priced products (the bottom block of his price file) to the site.

The client filled the 2026-11-03 Daraz "basic" export with prices from the bottom up, so the bottom
rows hold his latest prices. This script:
  * adds every priced bottom row that is not already in the catalogue as a new product
    (src/data/darazCatalogExtra.ts, kept apart so scripts/import_daraz_catalog.py can be rerun safely), and
  * records every bottom-row price in scripts/price_sources.json (replacing an older price for
    products that were already on the site, per scripts/client_price_file_matches.json).
Then run scripts/import_approved_prices.py to regenerate src/data/approvedPrices.ts.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from import_daraz_catalog import NS, ProductHtml, cell_value, column_name, valid_image_url  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SITE = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "Smart arcade general details" / "Product Catalog with client prices - 2026-11-03.xlsx"
SOURCES = Path(__file__).resolve().parent / "price_sources.json"
MATCHES = Path(__file__).resolve().parent / "client_price_file_matches.json"
EXTRA_OUT = SITE / "src" / "data" / "darazCatalogExtra.ts"
BOTTOM_FROM_ROW = 2400  # priced rows above this are older prices from the top of the sheet
CHECKED = "2026-11-03"
FILE_LABEL = "Client price file (Product Catalog with client prices - 2026-11-03.xlsx)"
# Column letters in this export (it has a PRICE column in C, so everything after it is one to the right).
IMAGES = tuple("FGHIJKLM")


def main() -> None:
    source = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not source.is_file():
        raise SystemExit(f"Price file not found: {source}")
    matches: dict[str, str] = json.loads(MATCHES.read_text(encoding="utf-8"))
    existing_ids = {
        str(item["id"])
        for item in json.loads(
            (SITE / "src" / "data" / "darazCatalog.ts").read_text(encoding="utf-8").split("export const darazCatalog: DarazCatalogRecord[] = ", 1)[1]
        )
    }

    with zipfile.ZipFile(source) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {item.attrib["Id"]: item.attrib["Target"] for item in relationships}
        sheet = workbook.find("main:sheets/main:sheet", NS)
        target = targets[sheet.attrib[f"{{{NS['rel']}}}id"]].lstrip("/")  # type: ignore[union-attr]
        sheet_path = target if target.startswith("xl/") else f"xl/{target}"
        shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        shared = ["".join(p.text or "" for p in item.findall(".//main:t", NS)) for item in shared_root.findall("main:si", NS)]
        sheet_root = ET.fromstring(archive.read(sheet_path))

        new_records: list[dict[str, object]] = []
        price_rows: list[tuple[str, float, int, str]] = []  # (site id, price, row, name)
        skipped: list[str] = []
        for row in sheet_root.findall(".//main:sheetData/main:row", NS):
            row_number = int(row.attrib["r"])
            if row_number < BOTTOM_FROM_ROW:
                continue
            data = {column_name(c.attrib["r"]): cell_value(c, shared) for c in row.findall("main:c", NS)}
            product_id, raw_price = data.get("A", ""), data.get("C", "").strip()
            if not product_id or not raw_price:
                continue
            if not re.fullmatch(r"\d+(\.\d+)?", raw_price) or float(raw_price) <= 0:
                skipped.append(f"row {row_number}: bad price {raw_price!r}")
                continue
            name = data.get("E", "") or data.get("D", "")
            if str(row_number) in matches:  # already on the site: price update only
                price_rows.append((matches[str(row_number)], float(raw_price), row_number, name))
                continue
            if product_id in existing_ids:
                price_rows.append((product_id, float(raw_price), row_number, name))
                continue

            gallery: list[str] = []
            for column in IMAGES:
                image = data.get(column, "")
                if image and valid_image_url(image) and image not in gallery:
                    gallery.append(image)
            description = ProductHtml()
            description.feed(data.get("T", ""))
            for image in description.images:
                if valid_image_url(image) and image not in gallery:
                    gallery.append(image)
            market = data.get("P", "")
            card = market if valid_image_url(market) else (gallery[0] if gallery else "")
            if market and valid_image_url(market) and market not in gallery:
                gallery.append(market)
            if not name or not card:
                skipped.append(f"row {row_number} ({product_id}): no {'name' if not name else 'photo'}")
                continue
            highlights = ProductHtml()
            highlights.feed(data.get("U", ""))
            lines = [re.sub(r"^[\s•●▪■*-]+", "", line).strip() for line in highlights.plain_text().splitlines()]
            lines = [line for line in dict.fromkeys(lines) if len(line) > 2][:12]
            new_records.append(
                {
                    "id": str(product_id),
                    "darazCategoryId": data.get("B", ""),
                    "nameEn": name,
                    "nameSi": data.get("D", "") if data.get("E", "") else "",
                    "cardImage": card,
                    "images": gallery,
                    "warrantyPeriod": data.get("R", ""),
                    "warrantyType": data.get("S", ""),
                    "warrantyPolicy": data.get("Q", ""),
                    "description": description.plain_text()[:2400],
                    "highlights": lines,
                    "sourceRow": row_number,
                }
            )
            price_rows.append((str(product_id), float(raw_price), row_number, name))

    header = (
        "// Generated by scripts/import_client_price_file.py from the client's price file (bottom block, latest prices).\n"
        "// Kept separate from darazCatalog.ts so re-running scripts/import_daraz_catalog.py cannot remove these products.\n"
        "import type { DarazCatalogRecord } from './darazCatalog'\n\n"
        "export const darazCatalogExtra: DarazCatalogRecord[] = "
    )
    EXTRA_OUT.write_text(header + json.dumps(new_records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    sources = [s for s in json.loads(SOURCES.read_text(encoding="utf-8")) if s.get("basis") != "client-price-file"]
    previous = {str(s["id"]): s for s in sources}
    for site_id, price, row_number, name in price_rows:
        old = previous.get(site_id)
        note = f"; replaces earlier price Rs. {int(old['price'])} ({old['basis']})" if old else ""
        sources = [s for s in sources if str(s["id"]) != site_id]
        sources.append(
            {
                "id": site_id,
                "name": name,
                "price": price,
                "priceFrom": False,
                "basis": "client-price-file",
                "source": f"{FILE_LABEL}, row {row_number}{note}",
                "range": None,
                "matchedTitle": None,
                "checked": CHECKED,
                "confidence": "client entered (bottom block = latest)",
            }
        )
    sources.sort(key=lambda s: str(s["id"]))
    SOURCES.write_text(json.dumps(sources, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"New products added: {len(new_records)}; price updates to existing products: {len(price_rows) - len(new_records)}")
    print(f"Skipped: {len(skipped)}")
    for line in skipped:
        print("  ", line)
    print(f"Wrote {EXTRA_OUT} and updated {SOURCES}")


if __name__ == "__main__":
    main()
