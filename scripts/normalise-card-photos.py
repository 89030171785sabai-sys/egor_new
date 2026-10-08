"""Lay out the white-backdrop studio shots as catalogue card images.

The seven products share one sweep, one light and one angle, but not one
distance: the bowl takes anywhere from a quarter to nearly half of its frame.
Each shot is therefore rescaled so that the bowl's rim lands on one width for
the whole line, and placed on a card-shaped canvas, bottom-aligned and centred
on the product.

The canvas is filled by the photograph itself rather than by a colour of ours.
A shot scaled down far enough to match the others no longer reaches the top of
the canvas, so the gap above it continues the sweep's own top edge, column by
column — the sweep is smooth and nearly flat up there, so the join does not
read. Keying the product out instead was tried first and does not work on this
set: the sweep is lit brightest behind the product, so a backdrop test either
keeps the hot centre or eats the chimney.

The result is one image per model, all the same shape, each filling its box
edge to edge — no frame around the photograph and nothing cropped off the
product.

Rim measurements are in pixels of the original frame. Six were found by
scanning for the widest unbroken dark run in the upper frame; Грант's bowl is
low and open enough that the bright steel interior breaks that run, so its rim
was measured off the larch band instead.

    python3 scripts/normalise-card-photos.py
"""
from PIL import Image, ImageFilter

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

# Card image shape and size. 10:9 is the shallowest box that holds the tallest
# composition — Оникс, whose chimney stands well clear of its bowl.
CANVAS = (1200, 1080)

# Share of the canvas width taken by every bowl's rim. Raising it enlarges the
# whole line together; past this, Оникс's chimney leaves the canvas.
RIM_SHARE = 0.458

# Where the product stands: its feet this far down the canvas, so the shot
# keeps a little floor under it.
FEET_AT = 0.95


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
    """The product's bounds — everything that is not the near-white sweep."""
    mask = image.convert('L').point(lambda v: 255 if v < 110 else 0)
    box = mask.getbbox()
    assert box, 'no product found against the backdrop'
    return box


def extend_upwards(image: Image.Image, height: int) -> Image.Image:
    """Carry the sweep's top edge up to fill a taller canvas.

    The top of every one of these frames is an even, near-white band, so
    repeating it reads as more of the same backdrop. The seam is softened so
    that the change of slope does not show as a line.
    """
    if height <= 0:
        return image
    edge = image.crop((0, 0, image.width, 8)).resize((image.width, 1), Image.LANCZOS)
    filler = edge.resize((image.width, height), Image.NEAREST)
    grown = Image.new('RGB', (image.width, image.height + height))
    grown.paste(filler, (0, 0))
    grown.paste(image, (0, height))
    seam = grown.crop((0, max(0, height - 24), image.width, height + 24))
    grown.paste(seam.filter(ImageFilter.GaussianBlur(9)), (0, max(0, height - 24)))
    return grown


cw, ch = CANVAS
print(f'{"model":20} {"scale":>7}  top colour and placement')
for name, rim_px in RIMS.items():
    original = Image.open(f'{SRC}/{name}-card.png').convert('RGB')
    x0, y0, x1, y1 = content_box(original)

    scale = RIM_SHARE * cw / rim_px
    shot = original.resize(
        (round(original.width * scale), round(original.height * scale)), Image.LANCZOS
    )

    # Feet on the floor line, product centred across the canvas.
    top = round(FEET_AT * ch - y1 * scale)
    left = round(cw / 2 - (x0 + x1) / 2 * scale)

    # A shot too tall for the canvas is simply hung above its top edge; one
    # too short has the sweep carried up to meet it.
    canvas = Image.new('RGB', CANVAS)
    if top > 0:
        shot = extend_upwards(shot, top)
        top = 0
    canvas.paste(shot, (left, top))
    canvas.save(f'{DST}/{name}-card.webp', 'WEBP', quality=88, method=6)

    # The colour the canvas starts on, for the card to carry on with where it
    # stands taller than the picture.
    edge = canvas.crop((0, 0, cw, 6)).resize((1, 1)).getpixel((0, 0))
    print(f'{name:20} {scale:>7.3f}  cardTop #%02x%02x%02x  shot {shot.width}x{shot.height}'
          % edge, f'at ({left}, {top})')
