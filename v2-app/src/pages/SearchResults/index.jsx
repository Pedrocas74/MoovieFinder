import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import styles from "./SearchResults.module.css";

import SortSelect from "../../components/filters/sortSelect";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("");

  const q = (params.get("q") || "").trim();

  useEffect(() => {
    if (!q) {
      setMovies([]);
      setError(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await searchMovies(q, [], 3); //fetch 3 pages for more results
        setMovies(results);
        if (!results?.length) setError("No movies found!");
      } catch {
        setError("Unable to fetch.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const sortedMovies = useMemo(() => {
    const list = [...movies];

    if (sort === "most_rated")
      return list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));

    if (sort === "lowest_rated")
      return list.sort((a, b) => (a.vote_average ?? 0) - (b.vote_average ?? 0));

    if (sort === "recent")
      return list.sort((a, b) =>
        (b.release_date ?? "").localeCompare(a.release_date ?? "")
      );

    if (sort === "oldest")
      return list.sort((a, b) =>
        (a.release_date ?? "").localeCompare(b.release_date ?? "")
      );

    if (sort === "crescent")
      return list.sort((a, b) =>
        (a.title ?? a.name ?? "").localeCompare(b.title ?? b.name ?? "")
      );

    if (sort === "decrescent")
      return list.sort((a, b) =>
        (b.title ?? b.name ?? "").localeCompare(a.title ?? a.name ?? "")
      );

    return list;
  }, [movies, sort]);

  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>{q ? `Results for “${q}”` : "Search"}</h2>

      <div className={styles.selectContainer}>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <MovieList
          movies={sortedMovies}
          layout="grid"
          onMovieClick={openMovie}
          emptyMessage="Type something to search or select genres."
        />
      )}
    </section>
  );
}
