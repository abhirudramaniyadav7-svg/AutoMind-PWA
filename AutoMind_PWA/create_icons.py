from PIL import Image, ImageDraw
from pathlib import Path

Path("icons").mkdir(exist_ok=True)

for size in (192, 512):
    img = Image.new("RGB", (size, size), "#07111f")
    draw = ImageDraw.Draw(img)

    margin = size // 10

    draw.rounded_rectangle(
        (margin, margin, size-margin, size-margin),
        radius=size // 5,
        fill="#087cf0"
    )

    draw.rounded_rectangle(
        (size*.20, size*.43, size*.80, size*.65),
        radius=size//12,
        fill="white"
    )

    draw.polygon([
        (size*.32, size*.43),
        (size*.42, size*.29),
        (size*.65, size*.29),
        (size*.76, size*.43)
    ], fill="white")

    for x in (size*.34, size*.68):
        draw.ellipse(
            (x-size*.065, size*.59,
             x+size*.065, size*.72),
            fill="#07111f"
        )

    img.save(f"icons/icon-{size}.png")

print("AutoMind AI icons generated successfully!")
