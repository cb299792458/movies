# Movie List App

A React app that browses movies from [The Movie Database (TMDB)](https://www.themoviedb.org/) with year and genre filters, infinite scroll, and links to TMDB for each title.

## Setup

```bash
npm install
cp .env.example .env
# Add your TMDB API key to .env
npm start
```

## Features

- Discover movies with year range and genre filters (AND logic for multiple genres)
- Infinite scroll pagination
- Responsive card grid with hover details and TMDB links

## Deploy to GitHub Pages

The live site URL is **https://cb299792458.github.io/movies/** (not the repo root).

1. In the repo on GitHub: **Settings → Secrets → Actions** → add `VITE_TMDB_API_KEY` with your TMDB key.
2. **Settings → Pages** → Source: **GitHub Actions** (not “Deploy from branch” on `main`).
3. Push to `main`. The workflow builds `dist/` with `base: /movies/` and deploys it.

Do not publish the raw source tree. The error `main.jsx` blocked as `text/html` means the browser got `index.html` instead of built JS—usually from deploying source or using the wrong base path.

Local preview of the production build:

```bash
npm run build:pages
npm run preview:pages
```
