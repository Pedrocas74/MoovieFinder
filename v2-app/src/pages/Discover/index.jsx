import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesBySource } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import SortSelect from "../../components/filters/sortSelect";
import SourceSelect from "../../components/filters/sourceSelect";
import GenreSelect from "../../components/filters/genreSelect";
import styles from "./Discover.module.css";

export default function Discover() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("trending");
  const [sort, setSort] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await getMoviesBySource(source);
        setMovies(results);
      } catch {
        setError("Unable to fetch movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [source]);

  const filteredAndSortedMovies = useMemo(() => {
    let list = [...movies];

    // Filter by genres if any selected
    if (genres.length > 0) {
      list = list.filter((movie) =>
        genres.some((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

    // Sort
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
        (b.title ?? a.name ?? "").localeCompare(a.title ?? a.name ?? "")
      );

    return list;
  }, [movies, sort, genres]);

  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>Discover Movies</h2>

      <div className={styles.filters}>
        <SourceSelect value={source} onChange={setSource} />
        <SortSelect value={sort} onChange={setSort} />
        <GenreSelect value={genres} onChange={setGenres} />
      </div>

      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <MovieList
          movies={filteredAndSortedMovies}
          layout="grid"
          onMovieClick={openMovie}
          emptyMessage="No movies found."
        />
      )}
    </section>
  );
}
