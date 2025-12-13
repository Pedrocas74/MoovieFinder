import { useEffect, useState } from "react";
import {
  getTrending,
  getNowInTheathers,
  getUpcoming,
  getPopular,
} from "../services/tmdb";

export function useHomeMovies() {
  const [data, setData] = useState({
    trending: [],
    nowPlaying: [],
    upcoming: [],
    popular: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      getTrending(),
      getNowInTheathers(),
      getUpcoming(),
      getPopular(),
    ]);

    const [tr, np, up, pop] = results;

    setData({
      trending: tr.status === "fulfilled" ? (tr.value.results ?? tr.value) : [],
      nowPlaying: np.status === "fulfilled" ? (np.value.results ?? np.value) : [],
      upcoming: up.status === "fulfilled" ? (up.value.results ?? up.value) : [],
      popular: pop.status === "fulfilled" ? (pop.value.results ?? pop.value) : [],
    });

    if (results.some((r) => r.status === "rejected")) {
      setError("Some sections failed to load.");
    }

    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await reload();
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...data, loading, error, reload };
}
