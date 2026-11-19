# Personal portfolio

A lightweight static site for GitHub Pages. It uses plain HTML, CSS, and JavaScript—no build step or dependencies required.

## Personalize it

Replace remaining bracketed prompts in `experience.html` with your job title, dates, achievements, skills, and graduation year. Add your preferred contact email before sharing the site.

The books and finds pages are read-only. Add or edit entries in `journal-data.js`, then publish the updated files. Each book has a title, author, and optional `liked` / `learned` notes; add planned reads to `toRead` with a title and optional author. Each find has a title, creator, URL, and note.

The mountain-biking and snowboarding pages are also read-only. Their public map pins and details are maintained in `adventure-data.js`, with `x` and `y` positions as percentages of the map image. Snowboard resort cards are ordered from most days to fewest; pins display unique recorded calendar days, with date-only visits in an expandable list. Edit the resort entries, counts, and dates as needed. Add biking trails using the same map-relative `x` and `y` positions and optional notes/photos.

Images in `pics/` are shown using `photography-data.js`. To add a photo, copy it into `pics/` and add an entry with its relative `src`, descriptive `alt`, `caption`, and `layout` (`tall`, `wide`, or `square`). Images fill their tile responsively; use `objectPosition` if you want to adjust the crop. The gallery lightbox opens the original image.

To add a photo to a home link card, set its `--card-image` style in `index.html`, for example `style="--card-image: url('pics/your-photo.jpg')"`. The card text remains in a high-contrast overlay.

The `slopes_data/` directory contains the original `.slopes` exports, including GPS tracks. It is intentionally excluded from Git by `.gitignore`; do not upload it to the public repository. The public site uses resort names, date-only visits, and aggregated run statistics from Slopes metadata—not GPS tracks, precise coordinates, or times of day.

The snowboarding page summarizes 75 Slopes activity exports: 74 unique calendar days, 508 runs, about 740.2 miles, 812,117 feet of vertical descent, and a 50.9 mph top speed. Distance and vertical totals come from exported run actions. The resort map counts unique dates at each resort (75 resort-days across seven resorts), so a date at both Sun Valley mountains counts once at each resort but only once in the overall day total. All displayed measurements are rounded; GPS-derived totals may vary in accuracy. If you add more sessions later, update these summary values in `snowboarding.html`; do not publish the raw exports.

Replace `assets/utah-map.svg` or `assets/west-map.svg` with your own map image and update the matching image `src` in `biking.html` or `snowboarding.html`. Review all public content before publishing.

## Publish at `username.github.io`

1. Create a GitHub repository named exactly `username.github.io`, using your GitHub username.
2. Add these project files to the repository root and push them to the `main` branch.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Visit `https://username.github.io` after the Pages deployment finishes.

The recipe notebook is intentionally omitted from the site navigation. Open `https://username.github.io/recipes.html` directly to access it. GitHub Pages serves public files to anyone, so an unlinked or `noindex` page is not private; don't put sensitive recipes or personal information there.
