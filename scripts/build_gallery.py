"""Generate static gallery markup, newest Git additions first (no dependencies)."""
from pathlib import Path
import html
import subprocess
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "Assets/Images/gallery"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


def added_at(path):
    history = subprocess.run(
        ["git", "log", "--follow", "--diff-filter=A", "--format=%ct", "--", path.relative_to(ROOT).as_posix()],
        cwd=ROOT, check=True, capture_output=True, text=True,
    ).stdout.splitlines()
    # Uncommitted photos are included in local previews as well.
    return int(history[-1]) if history else path.stat().st_mtime


def build():
    images = sorted(
        (p for p in GALLERY.rglob("*") if p.is_file() and p.suffix.lower() in EXTENSIONS),
        key=lambda p: (added_at(p), p.relative_to(GALLERY).as_posix()), reverse=True,
    )
    cards = []
    for number, path in enumerate(images, 1):
        url = html.escape(quote(path.relative_to(ROOT).as_posix(), safe="/"), quote=True)
        cards.append(
            f'                <a class="gallery-photo" href="{url}" '
            f'aria-label="View grooming photo {number} full size">\n'
            f'                    <img src="{url}" alt="Grooming moment at Sunshine Grooms — photo {number}" '
            'loading="lazy" decoding="async" width="600" height="600">\n'
            '                </a>'
        )
    if not cards:
        cards.append('                <p>New grooming moments coming soon.</p>')
    page = ROOT / "index.html"
    before, rest = page.read_text().split("<!-- gallery:start -->", 1)
    _, after = rest.split("<!-- gallery:end -->", 1)
    page.write_text(before + "<!-- gallery:start -->\n" + "\n".join(cards)
                    + "\n                <!-- gallery:end -->" + after)
    print(f"Gallery built with {len(images)} images.")


if __name__ == "__main__":
    build()
