#!/usr/bin/env python3
"""Generate site price data: sourced prices (price_sources.json) overridden by the workbook approved-price column."""

from __future__ import annotations

import json
import re
import sys
import zipfile
from decimal import Decimal, InvalidOperation
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "Smart arcade general details" / "Smart Arcade Competitive Pricing.xlsx"
CATALOG = Path(__file__).resolve().parents[1] / "src" / "data" / "darazCatalog.ts"
SOURCES = Path(__file__).resolve().parent / "price_sources.json"
CATALOG_EXTRA = Path(__file__).resolve().parents[1] / "src" / "data" / "darazCatalogExtra.ts"
OUTPUT = Path(__file__).resolve().parents[1] / "src" / "data" / "approvedPrices.ts"
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"main": MAIN_NS, "rel": REL_NS, "pkg": PKG_REL_NS}
SHEET_NAME = "Pricing"
ID_HEADER = "Site Product ID"
PRICE_HEADER = "Approved Smart Arcade Price (LKR)"


def column_index(cell_ref: str) -> int:
    letters = re.match(r"[A-Z]+", cell_ref)
    if not letters:
        raise ValueError(f"Invalid cell reference: {cell_ref}")
    value = 0
    for char in letters.group(0):
        value = value * 26 + ord(char) - ord("A") + 1
    return value - 1


def cell_text(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        inline = cell.find("main:is", NS)
        return "".join(part.text or "" for part in inline.findall(".//main:t", NS)).strip() if inline is not None else ""
    value = cell.find("main:v", NS)
    if value is None or value.text is None:
        return ""
    text = value.text.strip()
    if cell_type == "s" and text:
        return shared_strings[int(text)]
    return text


def workbook_sheet_path(archive: zipfile.ZipFile, requested_name: str) -> str:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {item.attrib["Id"]: item.attrib["Target"] for item in relationships.findall("pkg:Relationship", NS)}
    sheets = workbook.findall("main:sheets/main:sheet", NS)
    sheet = next((item for item in sheets if item.attrib.get("name") == requested_name), None)
    if sheet is None:
        raise ValueError(f"Workbook has no {requested_name!r} sheet")
    target = targets[sheet.attrib[f"{{{REL_NS}}}id"]].lstrip("/")
    return target if target.startswith("xl/") else f"xl/{target}"


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    return ["".join(part.text or "" for part in item.findall(".//main:t", NS)) for item in root.findall("main:si", NS)]


def read_rows(archive: zipfile.ZipFile, sheet_path: str, strings: list[str]) -> list[tuple[int, dict[int, str]]]:
    root = ET.fromstring(archive.read(sheet_path))
    output: list[tuple[int, dict[int, str]]] = []
    for row in root.findall(".//main:sheetData/main:row", NS):
        cells = {
            column_index(cell.attrib["r"]): cell_text(cell, strings)
            for cell in row.findall("main:c", NS)
        }
        output.append((int(row.attrib["r"]), cells))
    return output


def visible_catalog_ids() -> set[str]:
    records: list[dict] = []
    for path, prefix in (
        (CATALOG, "export const darazCatalog: DarazCatalogRecord[] = "),
        (CATALOG_EXTRA, "export const darazCatalogExtra: DarazCatalogRecord[] = "),
    ):
        if path.is_file():
            records += json.loads(path.read_text(encoding="utf-8").split(prefix, 1)[1])
    return {
        str(item["id"]).strip()
        for item in records
        if (item.get("nameEn") or item.get("nameSi")) and item.get("cardImage")
    }


def main() -> None:
    source = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not source.is_file():
        raise SystemExit(f"Pricing workbook not found: {source}")

    with zipfile.ZipFile(source) as archive:
        strings = shared_strings(archive)
        rows = read_rows(archive, workbook_sheet_path(archive, SHEET_NAME), strings)

    header_row = next((row for row in rows if ID_HEADER in row[1].values() and PRICE_HEADER in row[1].values()), None)
    if header_row is None:
        raise SystemExit(f"Could not find required columns {ID_HEADER!r} and {PRICE_HEADER!r}")
    header_number, header_cells = header_row
    id_col = next(col for col, value in header_cells.items() if value == ID_HEADER)
    price_col = next(col for col, value in header_cells.items() if value == PRICE_HEADER)
    allowed_ids = visible_catalog_ids()
    approved: dict[str, Decimal] = {}
    from_prices: set[str] = set()
    sourced = json.loads(SOURCES.read_text(encoding="utf-8")) if SOURCES.is_file() else []
    for item in sourced:
        if str(item["id"]) not in allowed_ids:
            raise SystemExit(f"price_sources.json: Product ID {item['id']!r} is not in the visible photo catalogue")
        approved[str(item["id"])] = Decimal(str(item["price"]))
        if item.get("priceFrom"):
            from_prices.add(str(item["id"]))
    sourced_ids = set(approved)

    seen: set[str] = set()
    for row_number, cells in rows:
        if row_number <= header_number:
            continue
        product_id = cells.get(id_col, "").strip()
        raw_price = cells.get(price_col, "").strip()
        if not product_id or not raw_price:
            continue
        if product_id not in allowed_ids:
            raise SystemExit(f"Row {row_number}: Product ID {product_id!r} is not in the visible photo catalogue")
        if product_id in seen:
            raise SystemExit(f"Row {row_number}: duplicate approved price for Product ID {product_id}")
        seen.add(product_id)
        try:
            price = Decimal(raw_price)
        except InvalidOperation as error:
            raise SystemExit(f"Row {row_number}: approved price must be a numeric LKR amount, got {raw_price!r}") from error
        if not price.is_finite() or price <= 0:
            raise SystemExit(f"Row {row_number}: approved price must be greater than zero")
        approved[product_id] = price
        from_prices.discard(product_id)  # a typed approval is a single fixed price

    values = {product_id: float(price) for product_id, price in sorted(approved.items())}
    declaration = (
        "// Generated by scripts/import_approved_prices.py from scripts/price_sources.json and the\n"
        "// Approved Smart Arcade Price (LKR) column of the pricing workbook (the workbook wins).\n"
        "export const approvedPrices: Record<string, number> = "
    )
    from_ids = json.dumps(sorted(from_prices), ensure_ascii=False, indent=2)
    OUTPUT.write_text(
        declaration + json.dumps(values, ensure_ascii=False, indent=2)
        + "\n\n// Products whose price is the lowest of several variants: shown as \"From Rs. …\".\n"
        + f"export const fromPriceIds: ReadonlySet<string> = new Set<string>({from_ids})\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(approved)} prices ({len(sourced_ids)} from price_sources.json, {len(approved) - len(sourced_ids & set(approved)) + len(sourced_ids & set(approved)) - len(sourced_ids)} extra from the workbook) into {OUTPUT}.")
    if not approved:
        print("No approved prices were entered; the site will continue to show price-pending labels.")


if __name__ == "__main__":
    main()
