import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = "recently_viewed_movies_v1";
const MAX = 20;

function normalizeMovie(movie) {
  if (!movie?.id) return null;
  return {
    id: movie.id,
    title: movie.title ?? movie.name ?? "",
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
  };
}

export function RecentlyViewedProvider({ children }) {
  const [recent, setRecent] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  }, [recent]);

  const addRecentlyViewed = (movie) => {
    const m = normalizeMovie(movie);
    if (!m) return;

    setRecent((prev) => {
      // remove if already exists, then put on top, then cap to 20
      const without = prev.filter((x) => x.id !== m.id);
      return [m, ...without].slice(0, MAX);
    });
  };

  const value = useMemo(() => ({ recent, addRecentlyViewed }), [recent]);
  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used inside RecentlyViewedProvider");
  return ctx;
}
