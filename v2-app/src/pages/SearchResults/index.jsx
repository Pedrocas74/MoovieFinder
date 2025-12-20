import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import styles from "./SearchResults.module.css";
import SourceSelect from "../../components/filters/sourceSelect";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("popular");
  const [sort, setSort] = useState("recent");
  const [isOpen, setIsOpen] = useState(false);

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
      <h2 className={styles.title}>{q ? `Results for “${q}”` : "Search"}</h2>
      <div className={styles.filterContainer}>
        <span className={styles.filters}>No filters applied.</span>
        <button onClick={() => setIsOpen(!isOpen)}>Sort menu</button>
      </div>


    {isOpen && (
      <section className={styles.filterMenu}>
        <h3>Filters</h3>
        <div>
          <SourceSelect value={source} onChange={setSource} />
        </div>
      </section>
    )}






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
