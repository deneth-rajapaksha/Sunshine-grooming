# Sunshine Grooms

The gallery uses a large photo preview with touch swiping, previous/next arrows,
and a horizontally scrolling thumbnail strip that highlights the current photo.
Select a thumbnail to jump to it. With the preview focused, keyboard users can
use Left/Right or Home/End. Full photos fit inside the preview without cropping.
Without JavaScript, the gallery falls back to linked photo tiles.

## Updating the gallery

Add photos to `Assets/Images/gallery` and push them to the repository's default
branch connected to Netlify. Netlify rebuilds and publishes the gallery automatically.
Supported formats: JPG, JPEG, PNG, WebP, GIF, and AVIF, including subfolders.
Folder names are case-sensitive.

Photos appear newest first, based on the Git commit that first added each file,
so editing an older photo does not move it to the top. Photos added together are
ordered by filename in descending order. File renames preserve their addition date.

## Netlify deployment

The root `netlify.toml` configures the build command
`python3 scripts/build_site.py` and publish directory `_site`. This packages
`index.html` and the complete `Assets` folder together and checks that every
local HTML and CSS asset exists before publishing. No package install is needed.
The build regenerates the gallery using Git addition dates on every deployment.

Push these files to the branch connected to your Netlify project. Check the
Netlify deploy log for “Website ready” and first test the `.netlify.app` address.
If that works but `sunshinegrooms.com` shows an older page or missing assets,
check Netlify Domain management and the domain's Cloudflare DNS records: the
domain must target this Netlify site. Use the DNS values Netlify provides for
your project. A successful Netlify deployment does not update another web host.

For a deployment preview, run `python3 scripts/build_site.py`, then serve `_site`
with any static web server. Uncommitted photos use their file modification dates
until they are committed. Generated gallery HTML is included in `index.html` so
the gallery works without JavaScript; publishing regenerates it automatically.
