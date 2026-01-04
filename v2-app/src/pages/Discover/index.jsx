import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMoviesBySource } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import SortSelect from "../../components/filters/sortSelect";
import SourceSelect from "../../components/filters/sourceSelect";
import GenreSelect from "../../components/filters/genreSelect";
import styles from "./Discover.module.css";

export default function Discover() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlSource = params.get("source");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(() => {
  return (
    urlSource ||
    sessionStorage.getItem("discover_source") ||
    "popular"
  );
});
  const [sort, setSort] = useState(
    sessionStorage.getItem("discover_sort") || ""
  );
  const [genres, setGenres] = useState(
    JSON.parse(sessionStorage.getItem("discover_genres") || "[]")
  );
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

  useEffect(() => {
  sessionStorage.setItem("discover_source", source);
  navigate(`/discover?source=${source}`, { replace: true });
}, [source]);

  useEffect(() => {
    sessionStorage.setItem("discover_sort", sort);
  }, [sort]);

  useEffect(() => {
    sessionStorage.setItem("discover_genres", JSON.stringify(genres));
  }, [genres]);

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

    //filter by genres if any selected (client-side for trending)
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

  const resetFilters = () => {
    setSource("popular");
    setSort("");
    setGenres([]);
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>Discover Movies</h2>

      <div className={styles.filters}>
        <SourceSelect value={source} onChange={setSource} />
        <SortSelect value={sort} onChange={setSort} />
        <GenreSelect value={genres} onChange={setGenres} />
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="btnPrimary"
        style={{
          margin: "0 auto 5vh auto",
        }}
      >
        Reset Filters
      </button>

      {loading && <SkeletonMovieList layout="grid" count={20} />}
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
