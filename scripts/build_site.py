"""Build the complete static site for Netlify and check local asset links."""
from html.parser import HTMLParser
import re
import shutil
import subprocess
from urllib.parse import unquote, urlsplit

from build_gallery import ROOT, build


class AssetLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"img", "script"} and attrs.get("src"):
            self.paths.append(attrs["src"])
        if tag == "link" and attrs.get("href"):
            self.paths.append(attrs["href"])


def check_asset(base, url, output):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path:
        return
    path = unquote(parts.path)
    target = output / path.lstrip("/") if path.startswith("/") else base / path
    if not target.is_file():
        raise RuntimeError(f"Missing published asset: {url}")


def main():
    # Build hosts may use shallow clones; addition dates require full history.
    shallow = subprocess.check_output(
        ["git", "rev-parse", "--is-shallow-repository"], cwd=ROOT, text=True
    ).strip()
    if shallow == "true":
        subprocess.run(["git", "fetch", "--unshallow"], cwd=ROOT, check=True)
    build()
    output = ROOT / "_site"
    output.mkdir(exist_ok=True)
    shutil.copy2(ROOT / "index.html", output / "index.html")
    # Replace only generated output so removed source photos cannot linger.
    if (output / "Assets").exists():
        shutil.rmtree(output / "Assets")
    shutil.copytree(ROOT / "Assets", output / "Assets")
    parser = AssetLinks()
    parser.feed((output / "index.html").read_text())
    for url in parser.paths:
        check_asset(output, url, output)
    for css in (output / "Assets/css").rglob("*.css"):
        for url in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css.read_text()):
            check_asset(css.parent, url.strip(), output)
    print(f"Website ready in {output}: all local HTML and CSS assets verified.")


if __name__ == "__main__":
    main()
