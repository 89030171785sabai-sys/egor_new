"""Normalise the hero shots so every tub reads at the same size on the page.

Each photograph was taken at its own distance, so the bowl's rim takes anywhere
from a quarter to two thirds of its frame. Two things bring them together: the
dead air at the sides is cropped away, and what remains is given a per-model
render width, so rim x width lands on one number for every model.

The script also reports each shot's own backdrop tone. The page lays that tone
behind the photograph as a soft glow, which is what lets the picture's edges be
faded out without the chimney going black against the page — an earlier attempt
to paint a background into the file itself always left a visible frame.

Crop boxes and rim measurements were read off a contact sheet with a percentage
grid — automatic detection kept latching onto floors and reflections rather
than the product.

    python3 scripts/normalise-hero-photos.py
"""
from PIL import Image

SRC = 'assets/photos-src'
DST = 'public/photos'

# name: (crop_left, crop_right, rim_left, rim_right) — all fractions of the
# original width. The rim is the widest point of the bowl.
SHOTS = {
    'grafit':           (0.00, 1.00, 0.120, 0.780),
    'valtsovavich':     (0.26, 0.74, 0.405, 0.685),
    'cherny-brilliant': (0.22, 0.84, 0.300, 0.720),
    'nefrit':           (0.20, 0.80, 0.290, 0.710),
    'oniks':            (0.20, 0.80, 0.240, 0.520),
    'oniks-pro':        (0.14, 0.84, 0.230, 0.600),
    'grant':            (0.12, 0.88, 0.190, 0.530),
}

# Width of the shot on a large screen, as a share of the viewport, before the
# per-model correction. The correction is capped so no shot runs past 80%.
MAX_LG = 0.80


def tone(image: Image.Image) -> str:
    """The shot's own backdrop colour, taken from the upper corners.

    The corners are backdrop in every one of these shots, and away from both
    the glow behind the product and the floor, so they carry the tone the page
    has to continue.
    """
    w, h = image.size
    band = max(1, round(h * 0.18))
    side = max(1, round(w * 0.16))
    patches = [image.crop((0, 0, side, band)), image.crop((w - side, 0, w, band))]
    pixels = [p for patch in patches for p in patch.convert('RGB').resize((8, 8)).getdata()]
    r = sum(p[0] for p in pixels) // len(pixels)
    g = sum(p[1] for p in pixels) // len(pixels)
    b = sum(p[2] for p in pixels) // len(pixels)
    # Lifted a little: a glow reads as light behind the product, not as a wash.
    lift = 1.35
    return '#%02x%02x%02x' % tuple(min(255, round(c * lift)) for c in (r, g, b))


rims = {}
for name, (cl, cr, rl, rr) in SHOTS.items():
    original = Image.open(f'{SRC}/{name}-hero.webp').convert('RGB')
    w, h = original.size
    cropped = original.crop((round(w * cl), 0, round(w * cr), h))
    cropped.save(f'{DST}/{name}-hero.webp', 'WEBP', quality=90, method=6)
    rims[name] = {'rim': (rr - rl) / (cr - cl), 'tone': tone(cropped), 'size': cropped.size}

# The most loosely framed shot sets the ceiling; the rest scale down to match.
target = MAX_LG * min(info['rim'] for info in rims.values())

print(f'{"model":20} {"heroWidth":>10}  {"heroTone":>9}  rendered rim')
for name, info in rims.items():
    lg = round(min(target / info['rim'], MAX_LG), 3)
    print(f'{name:20} {lg:>10}  {info["tone"]:>9}  {lg * info["rim"]:.4f}')
