import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const q = (params.get("q") || "").trim();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const results = await searchMovies(q);
        setMovies(results);
        if (!results?.length) setError("No movies found!");
      } catch (e) {
        setError("Unable to fetch.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>
        {q ? `Results for “${q}”` : "Search"}
      </h2>

      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <MovieList
          movies={movies}
          layout="grid"
          onMovieClick={openMovie}
          emptyMessage="Type something to search."
        />
      )}
    </section>
  );
}
