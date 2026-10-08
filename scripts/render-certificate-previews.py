"""Render the first page of each certificate as the card's preview image.

The documents are scanned PDFs with no text layer, so the only way to show
what is behind the link is to draw the page. One page is enough — it carries
the seal, the number and the signatures, which is what a visitor is looking
for before deciding whether to open the file.

    python3 scripts/render-certificate-previews.py
"""
import pymupdf

DOCS = 'public/docs'
DST = 'public/photos'

# Certificate file -> preview name, matching `src/data/certificates.ts`.
SHEETS = {
    'sertifikat-sootvetstviya-85590': 'cert-sootvetstviya.webp',
    'sertifikat-ekologicheskiy-85592': 'cert-ekologicheskiy.webp',
    'sertifikat-pozharnyy-85591': 'cert-pozharnyy.webp',
}

# The scans carry a dense guilloche pattern that costs a lot to encode, so
# this is kept to what the card actually needs rather than to what a reader
# would want — the PDF itself is one click away.
DPI = 78

for name, preview in SHEETS.items():
    page = pymupdf.open(f'{DOCS}/{name}.pdf')[0]
    pixmap = page.get_pixmap(dpi=DPI)
    pixmap.pil_save(f'{DST}/{preview}', 'WEBP', quality=72, method=6)
    print(f'{preview:28} {pixmap.width}x{pixmap.height}')
