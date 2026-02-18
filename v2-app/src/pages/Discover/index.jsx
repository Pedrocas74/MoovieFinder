import styles from "./Discover.module.css";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMoviesBySource } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import SourceSelect from "../../components/filters/sourceSelect";
import GenreSelect from "../../components/filters/genreSelect";
import LoadingSVG from "../../components/ui/LoadingSVG";
import ErrorPlaceholder from "../../components/feedback/ErrorPlaceholder";

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
  const [error, setError] = useState(null);
  const [source, setSource] = useState(() => {
    //memorize source filter chosen across navigation
    return urlSource || sessionStorage.getItem("discover_source") || "popular";
  });
  const [genres, setGenres] = useState(() => {
    if (urlGenre) {
      return [parseInt(urlGenre)];  //urlGenre comes as a string representing an index number, which has to be converted into an integer
    }
    return JSON.parse(sessionStorage.getItem("discover_genres") || "[]"); //memorize genres chosen across navigation
  });
  const [page, setPage] = useState(1); //current page number that is being fetched
  const [hasMore, setHasMore] = useState(true);  //tracks whether there are more results available to load
  const [loadingMore, setLoadingMore] = useState(false); //TRUE whenever it's fetching the next page (activate loadingSVG)
  const observerRef = useRef(); 
  const [passTheLimit, setPassTheLimit] = useState(false); //sets true when the user scrolls down 400px

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
          //add results of load more to the end of the previous movielist
          //OR just fresh load results
          setMovies((prev) => (append ? [...prev, ...results] : results)); 
          if (!append) setPage(1); //when doing a fresh load, reset to page 1
        }
      } catch { 
        setError("Unable to fetch movies.");
        if (!append) setMovies([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [source, genres],
  );

  //new filter selection handler -> resets everything and restarts fresh
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies(1);
  }, [source, genres, loadMovies]);

  useEffect(() => { //everytime source/genre changes, the new source/genre chosen replaces the old on the sessionStorage (during the current tab session)
    sessionStorage.setItem("discover_source", source);
    navigate(`/discover?source=${source}`, { replace: true });
  }, [source]);

  useEffect(() => {
    sessionStorage.setItem("discover_genres", JSON.stringify(genres));
  }, [genres]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || loadingMore) return;
    const nextPage = page + 1; 
    setPage(nextPage); //goes to next page
    loadMovies(nextPage, true); //fetches movies from next page
  }, [hasMore, loading, loadingMore, page, loadMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        //entries[0] because is just one element to be observed
        if (entries[0].isIntersecting && hasMore && !loadingMore) { //sets TRUE whenever the div element (observed element) enters the viewport
          loadMore();
        }
      },
      { threshold: 0 }, //as soon as any pixel is visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => { //cleanup 
      observer.disconnect();
    };
  }, [loadMore, hasMore, loadingMore]);

  const filteredMovies = useMemo(() => {
    let list = [...movies]; //shallow copy of the movies 

    // filter by genres if any selected (client-side for trending)
    if (genres.length > 0 && source === "trending") { //API endpoint 
      list = list.filter((movie) =>
        //keep movies that match ANY selected genre
        genres.some((genreId) => movie.genre_ids?.includes(genreId)),
      );
    }
    return list;
  }, [movies, genres, source]);


  useEffect(() => {
    const onScroll = () => {
      setPassTheLimit(window.scrollY >= 400); //after scrolling 400px, the btnToTop is displayed
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //navigation to individual movieDetails on card click
  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  //reseting filters after "reset btn" click
  const resetFilters = () => {
    setSource("popular");
    setGenres([]);
  };

  //on top arrow button click 
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

      <div
        className={styles.filters}
        role="region"
        aria-label="Discover filters"
      >
        <SourceSelect value={source} onChange={setSource} />
        <GenreSelect value={genres} onChange={setGenres} />
      </div>

      <div style={{ textAlign: "center" }}>
        {(urlSource !== "popular" || genres.length > 0) && (  //if source or genre selectors are untouched (source = popular AND no genres chosen)
          <button //display reset filters btn
            type="button"
            onClick={resetFilters}
            className="btnPrimary"
            style={{
              margin: "0 auto var(--space-xl) auto",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {loading && <SkeletonMovieList layout="grid" count={20} />}
      </div>
      
      {/* fallback */}
      {!loading && error && (
        <ErrorPlaceholder
          type="network"
          title="Couldn’t load movies"
          message="We had trouble fetching the movies."
          actionLabel="Retry"
          onAction={reload}
        />
      )}

      {!loading && !error && (
        <>
          <MovieList
            movies={filteredMovies}
            layout="grid"
            onMovieClick={openMovie}
            emptyMessage="No movies found."
          />
          {/* trigger to loadMore in case there is more to load  */}
          {/* whenever it enters on the viewport  */}
          {hasMore && (   
            <div
              ref={observerRef}
              aria-label="Load more trigger"
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

      {/* top arrow button  */}
      <AnimatePresence>
        {passTheLimit && (
          <motion.button
            type="button"
            className={`${styles.goTopBtn} actionButton`}
            onClick={navigateToTop}
            aria-label="Back to top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            exit={{ opacity: 0 }}
          >
            <ArrowUp
              color="var(--clr-muted)"
              aria-hidden="true"
              focusable="false"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
