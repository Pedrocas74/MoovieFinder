import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LibraryContext = createContext(null);

const STORAGE_KEY = "moo_library_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}


function toSavedMovie(movie) {
  if (!movie) return null;
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? null,
    vote_average: movie.vote_average ?? null,
  };
}

function toggleInList(list, movie) {
  const id = movie.id;
  const exists = list.some((m) => m.id === id);
  return exists ? list.filter((m) => m.id !== id) : [toSavedMovie(movie), ...list];
}

export function LibraryProvider({ children }) {
  const [state, setState] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEY), {
      watched: [],
      watchlist: [],
      favorites: [],
    })
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    const isIn = (key, id) => state[key].some((m) => m.id === id);

    const toggle = (key, movie) =>
      setState((prev) => ({ ...prev, [key]: toggleInList(prev[key], movie) }));

    return {
      watched: state.watched,
      watchlist: state.watchlist,
      favorites: state.favorites,

      isWatched: (id) => isIn("watched", id),
      isInWatchlist: (id) => isIn("watchlist", id),
      isFavorite: (id) => isIn("favorites", id),

      toggleWatched: (movie) => toggle("watched", movie),
      toggleWatchlist: (movie) => toggle("watchlist", movie),
      toggleFavorite: (movie) => toggle("favorites", movie),

      clearAll: () => setState({ watched: [], watchlist: [], favorites: [] }),
    };
  }, [state]);

  return <LibraryContext.Provider value={api}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider />");
  return ctx;
}
