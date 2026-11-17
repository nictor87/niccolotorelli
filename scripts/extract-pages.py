import json
import os
import shutil

import fitz
from PIL import Image, ImageChops

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public")
OUT = os.path.join(ROOT, "public", "images", "work")
HEIGHT = 1800
BLANK_THRESHOLD = 0.9

STORIES = [
    {
        "slug": "dust-28",
        "cover": "COLLIER SCHORR_COVER FREDDIE_DUST28.tif",
        "pdf": "Collier Schorr - Nicco Torelli - DUST28 HIGH RES.pdf",
        "extras": ["COLLIER SCHORR_COVER RICKY_DUST28.tif"],
        "skip": [],
        "feature": "cover",
    },
    {
        "slug": "dust-16-fire",
        "cover": "HUGO COMTE - COVER DUST16_HIGH.jpg",
        "pdf": "Hugo Comte - Nicco Torelli LOW res.pdf",
        "extras": ["HUGO COMTE - GRACE COVER DUST16_HIGH.jpg", "HUGO COMTE - GRACE2 COVER DUST16_HIGH.jpg"],
        "skip": ["p1L", "p1R"],
        "feature": "p3R",
    },
    {
        "slug": "dust-22",
        "cover": "COVER DUST 22_8.jpg",
        "pdf": "Nico Bustos - Nicco Torelli - Pedro Almodovar.pdf",
        "extras": [],
        "skip": ["p1L", "p5R", "p6L", "p6R", "p7L", "p8R", "p9L", "p9R"],
        "feature": "p2R",
    },
    {
        "slug": "dust-23",
        "cover": "DUST 23 COVERS_3.jpg",
        "pdf": "RYAN MCGINLEY_DUST23_DEF.pdf",
        "extras": [],
        "skip": [],
        "feature": "cover",
    },
    {
        "slug": "dust-27",
        "cover": "Collier Schorr Cover DUST27.tif",
        "pdf": "Collier Schorr_Nicco Torelli_DUST 27.pdf",
        "extras": [],
        "skip": [],
        "feature": "p3R",
    },
    {
        "slug": "dust-21",
        "cover": "COVERS X INSIDE76.jpg",
        "pdf": "ROE ETHRIDGE - NICCO TORELLI DUST 21 DEF.pdf",
        "extras": [],
        "skip": [],
        "feature": "p2R",
    },
    {
        "slug": "dust-29",
        "cover": None,
        "pdf": "DUST29_Pavel Golik - Nicco Torelli_HR.pdf",
        "extras": [],
        "skip": [],
        "feature": "p1R",
    },
    {
        "slug": "dust-24",
        "cover": "Bobby Brazier - Mark Luckasavage.jpg",
        "pdf": "Mark Luckasavage - Nicco Torelli_DUST24.pdf",
        "extras": [],
        "skip": [],
        "feature": "p3L",
    },
    {
        "slug": "dust-16-victory",
        "cover": None,
        "pdf": "Gareth McConnell - Nicco Torelli LOW res.pdf",
        "extras": [],
        "skip": ["p1L", "p1R"],
        "feature": "p2R",
    },
    {
        "slug": "dust-25",
        "cover": "DUST 25 STORY HIGHLIGHTS_18.jpg",
        "pdf": "Collier Schorr - Nicco Torelli.pdf",
        "extras": ["DUST 25 STORY HIGHLIGHTS_17.jpg"],
        "skip": [],
        "feature": "p4L",
    },
    {
        "slug": "dust-15",
        "cover": None,
        "pdf": "VETEMENTS - PATRICK WELDE LOW RES.pdf",
        "extras": [],
        "skip": [],
        "feature": "p2L",
    },
]


def trim_margin(im):
    corner = im.getpixel((4, 4))
    bg = Image.new(im.mode, im.size, corner)
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 18 else 0)
    box = diff.getbbox()
    return im.crop(box) if box else im


def load_file(name):
    im = Image.open(os.path.join(SRC, name))
    im.draft("RGB", (HEIGHT * 2, HEIGHT * 2))
    im = im.convert("RGB")
    if im.height / im.width > 1.5:
        im = trim_margin(im)
    return im


def render_half(page, side):
    zoom = HEIGHT / page.rect.height
    half = page.rect.width / 2
    x0 = 0 if side == "L" else half
    clip = fitz.Rect(x0, 0, x0 + half, page.rect.height)
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def is_blank(im):
    small = im.convert("L").resize((60, 80))
    pixels = list(small.getdata())
    return sum(1 for value in pixels if value > 235) / len(pixels) >= BLANK_THRESHOLD


def save(im, path):
    if im.height != HEIGHT:
        im = im.resize((round(im.width * HEIGHT / im.height), HEIGHT), Image.LANCZOS)
    im.save(path, "WEBP", quality=85, method=6)
    return {"w": im.width, "h": im.height}


def extract(story):
    slug = story["slug"]
    folder = os.path.join(OUT, slug)
    os.makedirs(folder, exist_ok=True)
    entries = []

    def add(image, key, sheet):
        name = f"{len(entries) + 1:02d}.webp"
        size = save(image, os.path.join(folder, name))
        entries.append({"src": f"/images/work/{slug}/{name}", **size, "key": key, "sheet": sheet})

    if story["cover"]:
        add(load_file(story["cover"]), "cover", "cover")

    document = fitz.open(os.path.join(SRC, story["pdf"]))
    for number, page in enumerate(document, start=1):
        for side in ("L", "R"):
            key = f"p{number}{side}"
            if key in story["skip"]:
                continue
            image = render_half(page, side)
            if is_blank(image):
                continue
            add(image, key, f"p{number}")

    for index, extra in enumerate(story["extras"], start=1):
        add(load_file(extra), f"extra{index}", f"extra{index}")

    if not any(entry["key"] == story["feature"] for entry in entries):
        raise SystemExit(f"{slug}: feature {story['feature']} missing")
    print(slug, len(entries), flush=True)
    return entries


def extract_lead():
    page = fitz.open(os.path.join(SRC, "RYAN MCGINLEY_DUST23_DEF.pdf"))[7]
    zoom = 1600 / page.rect.height
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    spread = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    spread.save(os.path.join(OUT, "dust-23", "spread.webp"), "WEBP", quality=85, method=6)
    return {"slug": "dust-23", "src": "/images/work/dust-23/spread.webp", "w": spread.width, "h": spread.height}


if os.path.isdir(OUT):
    shutil.rmtree(OUT)

manifest = {story["slug"]: extract(story) for story in STORIES}
features = {story["slug"]: story["feature"] for story in STORIES}

with open(os.path.join(ROOT, "app", "pages.json"), "w") as f:
    json.dump(manifest, f, indent=2)
with open(os.path.join(ROOT, "app", "features.json"), "w") as f:
    json.dump(features, f, indent=2)
with open(os.path.join(ROOT, "app", "lead.json"), "w") as f:
    json.dump(extract_lead(), f, indent=2)
