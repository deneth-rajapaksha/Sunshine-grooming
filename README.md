# Sunshine Grooms

The gallery uses a large photo preview with touch swiping, previous/next arrows,
and a horizontally scrolling thumbnail strip that highlights the current photo.
Select a thumbnail to jump to it. With the preview focused, keyboard users can
use Left/Right or Home/End. Full photos fit inside the preview without cropping.
Without JavaScript, the gallery falls back to linked photo tiles.

## Updating the gallery

Add photos to `Assets/Images/gallery` and push them to the repository's default
branch. The GitHub Actions workflow rebuilds and publishes the gallery automatically.
Supported formats: JPG, JPEG, PNG, WebP, GIF, and AVIF, including subfolders.
Folder names are case-sensitive.

Photos appear newest first, based on the Git commit that first added each file,
so editing an older photo does not move it to the top. Photos added together are
ordered by filename in descending order. File renames preserve their addition date.

One-time hosting setup: in GitHub **Settings → Pages → Build and deployment**,
select **GitHub Actions** as the source. Keep the existing custom domain configured
there if using one. After pushing the workflow, its run appears under **Actions**.

For a local preview, run `python3 scripts/build_gallery.py`, then serve this folder
with any static web server. Uncommitted photos use their file modification dates
until they are committed. Generated gallery HTML is included in `index.html` so
the gallery works without JavaScript; publishing regenerates it automatically.
