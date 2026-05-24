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
