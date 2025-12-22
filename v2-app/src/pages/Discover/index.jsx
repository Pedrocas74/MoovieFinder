import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  const [source, setSource] = useState("popular");
  const [sort, setSort] = useState("");
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();

  const loadMovies = useCallback(
    async (currentPage, append = false) => {
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);
        setError(null);
        const results = await getMoviesBySource(source, currentPage, genres);
        if (!results || results.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setMovies((prev) => (append ? [...prev, ...results] : results));
          if (!append) setPage(1);
        }
      } catch {
        setError("Unable to fetch movies.");
        if (!append) setMovies([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [source, genres]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies(1, false);
  }, [source, genres, loadMovies]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage, true);
  }, [hasMore, loading, loadingMore, page, loadMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore]);

  const filteredAndSortedMovies = useMemo(() => {
    let list = [...movies];

    // Filter by genres if any selected (client-side for trending)
    if (genres.length > 0 && source === "trending") {
      list = list.filter((movie) =>
        genres.some((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

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
  }, [movies, sort, genres, source]);

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
        <>
          <MovieList
            movies={filteredAndSortedMovies}
            layout="grid"
            onMovieClick={openMovie}
            emptyMessage="No movies found."
          />
          {hasMore && (
            <div
              ref={observerRef}
              style={{ height: "20px", background: "transparent" }}
            >
              {loadingMore && <p>Loading more...</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}
