#!/usr/bin/env python3
"""Import the supplied Daraz export into a safe, static TypeScript data file."""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "Smart arcade general details" / "Product Catelog-Daraz export.xlsx"
OUTPUT = Path(__file__).resolve().parents[1] / "src" / "data" / "darazCatalog.ts"
NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
IMAGE_COLUMNS = tuple("EFGHIJKL")


class ProductHtml(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.text: list[str] = []
        self.images: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"br", "p", "div", "li", "ul", "ol", "h1", "h2", "h3", "tr"}:
            self.text.append("\n")
        if tag == "img":
            src = dict(attrs).get("src")
            if src:
                self.images.append(src.strip())

    def handle_endtag(self, tag: str) -> None:
        if tag in {"p", "div", "li", "ul", "ol", "h1", "h2", "h3", "tr"}:
            self.text.append("\n")

    def handle_data(self, data: str) -> None:
        self.text.append(data)

    def plain_text(self) -> str:
        return "\n".join(line.strip() for line in "".join(self.text).splitlines() if line.strip())


def column_name(cell_ref: str) -> str:
    return re.match(r"[A-Z]+", cell_ref).group(0)  # type: ignore[union-attr]


def cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    inline = cell.find("main:is", NS)
    value = cell.find("main:v", NS)
    if inline is not None:
        text = "".join(part.text or "" for part in inline.findall(".//main:t", NS))
    else:
        text = value.text or "" if value is not None else ""
    if cell.attrib.get("t") == "s" and text:
        return shared_strings[int(text)]
    return text.strip()


def valid_image_url(value: str) -> bool:
    parsed = urlsplit(value)
    return (
        parsed.scheme == "https"
        and parsed.hostname == "static-01.daraz.lk"
        and parsed.path.startswith("/p/")
    )


def main() -> None:
    source = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not source.is_file():
        raise SystemExit(f"Catalogue workbook not found: {source}")

    with zipfile.ZipFile(source) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relation_targets = {item.attrib["Id"]: item.attrib["Target"] for item in relationships}
        sheet = workbook.find("main:sheets/main:sheet", NS)
        if sheet is None:
            raise SystemExit("Workbook has no worksheets")
        target = relation_targets[sheet.attrib[f"{{{NS['rel']}}}id"]].lstrip("/")
        sheet_path = target if target.startswith("xl/") else f"xl/{target}"
        shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        shared_strings = [
            "".join(part.text or "" for part in item.findall(".//main:t", NS))
            for item in shared_root.findall("main:si", NS)
        ]
        sheet_root = ET.fromstring(archive.read(sheet_path))

        records: list[dict[str, object]] = []
        rejected_images = 0
        for row in sheet_root.findall(".//main:sheetData/main:row", NS):
            row_number = int(row.attrib["r"])
            if row_number == 1:
                continue
            data = {
                column_name(cell.attrib["r"]): cell_value(cell, shared_strings)
                for cell in row.findall("main:c", NS)
            }
            product_id = data.get("A", "")
            if not product_id:
                continue

            gallery: list[str] = []
            for column in IMAGE_COLUMNS:
                image = data.get(column, "")
                if image:
                    if valid_image_url(image):
                        if image not in gallery:
                            gallery.append(image)
                    else:
                        rejected_images += 1

            description_parser = ProductHtml()
            description_parser.feed(data.get("S", ""))
            for image in description_parser.images:
                if valid_image_url(image):
                    if image not in gallery:
                        gallery.append(image)
                else:
                    rejected_images += 1

            market_image = data.get("O", "")
            if market_image and valid_image_url(market_image):
                if market_image not in gallery:
                    gallery.append(market_image)
            elif market_image:
                rejected_images += 1

            highlight_parser = ProductHtml()
            highlight_parser.feed(data.get("T", ""))
            highlights = [
                re.sub(r"^[\s•●▪■*-]+", "", line).strip()
                for line in highlight_parser.plain_text().splitlines()
            ]
            highlights = [line for line in dict.fromkeys(highlights) if len(line) > 2][:12]

            name_en = data.get("D", "")
            name_si = data.get("C", "")
            card_image = market_image if valid_image_url(market_image) else (gallery[0] if gallery else "")
            records.append(
                {
                    "id": str(product_id),
                    "darazCategoryId": data.get("B", ""),
                    "nameEn": name_en,
                    "nameSi": name_si,
                    "cardImage": card_image,
                    "images": gallery,
                    "warrantyPeriod": data.get("Q", ""),
                    "warrantyType": data.get("R", ""),
                    "warrantyPolicy": data.get("P", ""),
                    "description": description_parser.plain_text()[:2400],
                    "highlights": highlights,
                    "sourceRow": row_number,
                }
            )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    declaration = """// Generated from the supplied Daraz catalogue export. Prices, stock, and category labels are not in that source.
export interface DarazCatalogRecord {
  id: string
  darazCategoryId: string
  nameEn: string
  nameSi: string
  cardImage: string
  images: string[]
  warrantyPeriod: string
  warrantyType: string
  warrantyPolicy: string
  description: string
  highlights: string[]
  sourceRow: number
}

export const darazCatalog: DarazCatalogRecord[] = """
    OUTPUT.write_text(declaration + json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    named = sum(bool(item["nameEn"] or item["nameSi"]) for item in records)
    images = sum(len(item["images"]) for item in records)
    print(f"Imported {len(records)} product IDs ({named} named), {images} distinct product photos.")
    print(f"Rows missing both product names: {len(records) - named}; rejected image URLs: {rejected_images}.")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
