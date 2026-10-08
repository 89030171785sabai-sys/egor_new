"""Normalise the white-backdrop studio shots used on the catalogue cards.

The seven products were photographed on one sweep, in one light, from one
angle — but not from one distance, so the bowl takes anywhere from a quarter
to nearly half of its frame. Two steps bring them together: each shot is
cropped to its own product, and each is given a render width, so rim x width
lands on the same number for every model and the bowls read as one line.

Why the width is not baked into the file: equalising the rims by padding or
windowing inside the source cannot work for this set — Грант is framed so
loosely that its window would have to be wider than the photograph, while
Оникс has a chimney too tall for the window that its own rim would demand.
Decoupling the width from the file is what lets every bowl match.

Rim measurements are in pixels of the original frame. Six were found by
scanning for the widest unbroken dark run in the upper frame; Грант's bowl is
low and open enough that the bright steel interior breaks that run, so its rim
was measured off the larch band instead.

    python3 scripts/normalise-card-photos.py
"""
from PIL import Image

SRC = 'assets/photos-src'
DST = 'public/photos'

RIMS = {
    'grafit': 589,
    'cherny-brilliant': 561,
    'valtsovavich': 429,
    'nefrit': 563,
    'oniks': 420,
    'oniks-pro': 492,
    'grant': 724,
}

# Breathing room around the product, as a fraction of its own bounding box.
MARGIN = 0.04

# Ceiling on how wide a card shot may run inside its box. The most loosely
# framed model takes it and the rest come down to match.
MAX_CARD = 0.96


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
    """The product's bounds — everything that is not the near-white sweep."""
    mask = image.convert('L').point(lambda v: 255 if v < 110 else 0)
    box = mask.getbbox()
    assert box, 'no product found against the backdrop'
    return box


rims = {}
for name, rim_px in RIMS.items():
    original = Image.open(f'{SRC}/{name}-card.png').convert('RGB')
    w, h = original.size
    x0, y0, x1, y1 = content_box(original)
    pad = round((x1 - x0) * MARGIN)
    crop = (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
    cropped = original.crop(crop)
    cropped.save(f'{DST}/{name}-card.webp', 'WEBP', quality=88, method=6)
    rims[name] = {'rim': rim_px / cropped.width, 'size': cropped.size}

target = MAX_CARD * min(info['rim'] for info in rims.values())

print(f'{"model":20} {"cardWidth":>10}  {"rim":>7}  shape')
for name, info in rims.items():
    width = round(min(target / info['rim'], MAX_CARD), 3)
    cw, ch = info['size']
    print(f'{name:20} {width:>10}  {width * info["rim"]:.4f}  {cw}x{ch} -> '
          f'{width * ch / cw:.3f} of box width')
