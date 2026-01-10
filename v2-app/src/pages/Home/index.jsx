import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import { useHomeMovies } from "../../hooks/useHomeMovies";
import { useRecentlyViewed } from "../../context/RecentlyViewed";
import SeeMoreCard from "../../components/movie/MovieCard/SeeMoreCard";
import ErrorPlaceholder from "../../components/feedback/ErrorPlaceholder";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const navigate = useNavigate();

  const { trending, nowPlaying, upcoming, loading, error, reload } =
    useHomeMovies();

  const { recent } = useRecentlyViewed();

  const [trendingSort, setTrendingSort] = useState("");
  const [upcomingSort, setUpcomingSort] = useState("");
  const [nowPlayingSort, setNowPlayingSort] = useState("");
  const [recentSort, setRecentSort] = useState("");

  const [showHint, setShowHint] = useState(false);

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const MIN_SKELETON_MS = 1200;
  const [minTimePassed, setMinTimePassed] = useState(false);
  const showSkeleton = loading || !minTimePassed;

  useEffect(() => {
    if (!loading) return;

    setMinTimePassed(false);
    const t = setTimeout(() => setMinTimePassed(true), MIN_SKELETON_MS);

    return () => clearTimeout(t);
  }, []);

  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  //show the hint on how to use long-press on moviecards
  useEffect(() => {
    if (!isTouchDevice) return;
    if (showSkeleton) return;
    if (error) return;

    const key = "moo_hint_longpress_v1";
    if (localStorage.getItem(key) === "1") return;

    const t = setTimeout(() => setShowHint(true), 800); //delay
    return () => clearTimeout(t);
  }, [isTouchDevice, showSkeleton, error]);

  const dismissHint = () => {
    localStorage.setItem("moo_hint_longpress_v1", "1");
    setShowHint(false);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {error && (
        <ErrorPlaceholder
          type="unknown"
          title="Loading Error"
          message={error}
          actionLabel="Retry all"
          onAction={reload}
          compact
        />
      )}

      {showSkeleton ? (
        <SkeletonMovieList title="Trending" />
      ) : (
        trending.length > 0 && (
          <MovieList
            title="Trending"
            movies={trending}
            layout="row"
            onMovieClick={handleOpenDetails}
            sort={trendingSort}
            onSortChange={setTrendingSort}
            tailCard={
              <SeeMoreCard
                label="See all trending"
                onClick={() => navigate("/discover?source=trending")}
              />
            }
          />
        )
      )}

      {showSkeleton ? (
        <SkeletonMovieList title="Upcoming" />
      ) : (
        upcoming.length > 0 && (
          <MovieList
            title="Upcoming"
            movies={upcoming}
            layout="row"
            onMovieClick={handleOpenDetails}
            sort={upcomingSort}
            onSortChange={setUpcomingSort}
            tailCard={
              <SeeMoreCard
                label="See all upcoming"
                onClick={() => navigate("/discover?source=upcoming")}
              />
            }
          />
        )
      )}

      {showSkeleton ? (
        <SkeletonMovieList title="Now Playing" />
      ) : (
        nowPlaying.length > 0 && (
          <MovieList
            title="Now Playing"
            movies={nowPlaying}
            layout="row"
            onMovieClick={handleOpenDetails}
            sort={nowPlayingSort}
            onSortChange={setNowPlayingSort}
            tailCard={
              <SeeMoreCard
                label="See all now playing"
                onClick={() => navigate("/discover?source=now_playing")}
              />
            }
          />
        )
      )}

      {recent.length > 0 && (
        <MovieList
          title="Recently viewed"
          movies={recent}
          layout="row"
          onMovieClick={handleOpenDetails}
          sort={recentSort}
          onSortChange={setRecentSort}
        />
      )}

      {showHint && isTouchDevice && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setShowHint(false)}
        >
          <Alert
            severity="info"
            sx={{
              backgroundColor: "var(--clr-text)",
              color: "var(--clr-bg)",
              fontWeight: 200,
              "& .MuiAlert-icon": {
                color: "var(--clr-primary)",
              },
            }}
          >
            <strong style={{ fontWeight: 700 }}>Press &amp; hold</strong> a
            movie card for quick actions
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
