
# Moo - Movie Finder

**Moo** is a modern movie discovery web app built for people who love cinema and want a better way to keep track of it.
It’s designed to feel calm, personal, and intentional—less about endless scrolling, more about curating your own movie journey.

**Live demo:** https://moovie-finder.vercel.app/


## What Moo Does

Moo lets you: 

* Discover movies using search, trends, popularity, and upcoming releases

* Explore rich movie details (cast, crew, trailers, screenshots, recommendations)

* Track your history by marking movies as *watched*, saving to *watchlist* and adding to *favorites*

* Store recently viewed movies (persisted locally)

* Light & Dark mode with system preference support

* Persistent state via localStorage (no account required)

Moo is mostly finished, with a few experimental features still evolving (like authentication ideas and recent UX experiments).


## Tech Stack

* **React** — UI & state composition

* **React Router** — Client-side routing

* **Vite** — Fast development & build tooling

* **CSS Modules** — Scoped, maintainable styles

* **TMDB API** — Movie data, images, trailers

* **Framer Motion** — Animations & transitions

* **MUI (Material UI)** — Icons, tooltips, feedback components

* **Figma** - Logo design

## Architecture highlights

* **Context-based state management**
    * `ThemeContext`- light/dark mode with persistence
    * `LibraryContext`- watched, watchlist, favorites
    * `RecentlyViewedContext` - last viewed movies (de-duplicated, capped)
* **Progressive data loading**
    * Optimistic navigation with route state
    * Graceful fallbacks when data isn’t preloaded

* **Accessibility-first mindset**
    * ARIA labels, keyboard navigation, focus states

* **Image optimization**
    * Responsive TMDB image sizes
    * Lazy loading where appropriate

## Key Features in Detail 
    
### Movie Details Page
* Backdrop hero with logo/title fallback

* Trailer modal with graceful “not available” handling

* Screenshot lightbox with keyboard navigation

* Smart recommendations (recommended + similar merged & deduped)

### Library System

* Watchlist, Watched, Favorites

* Toggle actions with immediate visual feedback

* Stored locally for simplicity and privacy

### Theming

* Automatic system preference detection

* Manual toggle

* Fully theme-driven design tokens (CSS variables)

## Getting Started Locally (bash)
### 1. Clone the repo

```
git clone https://github.com/your-username/moo.git
cd moo
```
### 2. Install dependencies

```
npm install
```
### 3. Environment variables
Moo uses the TMDB API.
Create a `.env`file: 
```
VITE_TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
```
> Only a brief setup is required — no backend or database.

### 4. Run the app

```
npm run dev
```

## Work in Progress / Experiments
* Authentication & user accounts (concept phase)

* UX refinements and micro-interactions

* Performance & accessibility audits

* Expanded discovery filters

These are intentionally separated from the core experience to keep Moo usable and focused.

## Why Moo?
Moo isn’t just about finding movies.
It’s about **remembering what you’ve watched, saving what matters**, and **building a personal relationship with cinema**—without noise, ads, or algorithms pushing endlessly.

## Author
Built with care by * **Pedro Magalhães** * 

Frontend-focused, cinema-loving developer <3