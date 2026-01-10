import styles from "./Discover.module.css";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMoviesBySource } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import SourceSelect from "../../components/filters/sourceSelect";
import GenreSelect from "../../components/filters/genreSelect";
import LoadingSVG from "../../components/ui/LoadingSVG";

import { motion, AnimatePresence } from "framer-motion";

import { ArrowUp } from "lucide-react";

export default function Discover() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlSource = params.get("source");
  const urlGenre = params.get("genre");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [showLoadingMore, setShowLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(() => {
    return urlSource || sessionStorage.getItem("discover_source") || "popular";
  });
  const [genres, setGenres] = useState(() => {
    if (urlGenre) {
      return [parseInt(urlGenre)];
    }
    return JSON.parse(sessionStorage.getItem("discover_genres") || "[]");
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();

  const [passTheLimit, setPassTheLimit] = useState(false);

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

  const filteredMovies = useMemo(() => {
    let list = [...movies];

    //filter by genres if any selected (client-side for trending)
    if (genres.length > 0 && source === "trending") {
      list = list.filter((movie) =>
        genres.some((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

    return list;
  }, [movies, genres, source]);

  useEffect(() => {
    const onScroll = () => {
      setPassTheLimit(window.scrollY >= 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //show the loadingSVG for at least 2 seconds
  // useEffect(() => {
  //   if (!loadingMore) {
  //     setShowLoadingMore(false);
  //     return;
  //   }

  //   setShowLoadingMore(true);

  //   const timer = setTimeout(() => {
  //     setShowLoadingMore(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [loadingMore]);

  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const resetFilters = () => {
    setSource("popular");
    setGenres([]);
  };

  const navigateToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    return;
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>Discover Movies</h2>

      <div className={styles.filters}>
        <SourceSelect value={source} onChange={setSource} />
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
            movies={filteredMovies}
            layout="grid"
            onMovieClick={openMovie}
            emptyMessage="No movies found."
          />
          {hasMore && (
            <div
              ref={observerRef}
              style={{
                height: "20vh",
                background: "transparent",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loadingMore && <LoadingSVG />}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {passTheLimit && (
          <motion.button
            type="button"
            className={`${styles.goTopBtn} actionButton`}
            onClick={navigateToTop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            exit={{ opacity: 0 }}
          >
            <ArrowUp color="var(--clr-muted)" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
