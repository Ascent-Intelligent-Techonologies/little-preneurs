# Littlepreneurs — Season 02 · Christmas Special

Static website for Littlepreneurs Season 02 (20 December, 12–5 PM, T-Works, Hyderabad), built from the Season 2 brochure.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Structure

- `index.html` – single-page site
- `css/styles.css`, `js/main.js` – styling, nav, lightbox, click-to-play video embeds
- `assets/img/` – images extracted from the brochure (WebP)

## Updating content

- **Videos**: edit the `data-embed` URLs in the "Watch" section of `index.html` (Instagram `/p/<id>/embed/captioned`, YouTube embed URL).
- **Story highlights**: the Instagram highlights link sits at the bottom of the "Watch" section. Instagram requires login to view highlights, so media can't be embedded; to show them on-site, export the clips and add them as `<video>` or images.
- **Gallery**: drop new WebP files in `assets/img/` and add a `<figure>` in the gallery sections.
