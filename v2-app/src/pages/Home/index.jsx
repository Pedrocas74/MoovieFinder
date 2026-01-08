import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import { useHomeMovies } from "../../hooks/useHomeMovies";
import { useRecentlyViewed } from "../../context/RecentlyViewed";
import SeeMoreCard from "../../components/movie/MovieCard/SeeMoreCard";
import ErrorPlaceholder from "../../components/feedback/ErrorPlaceholder";

export default function Home() {
  const navigate = useNavigate();

  const { trending, nowPlaying, upcoming, loading, error, reload } =
    useHomeMovies();

  const { recent } = useRecentlyViewed();

  const [trendingSort, setTrendingSort] = useState("");
  const [upcomingSort, setUpcomingSort] = useState("");
  const [nowPlayingSort, setNowPlayingSort] = useState("");
  const [recentSort, setRecentSort] = useState("");

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const MIN_SKELETON_MS = 1200;
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    if (!loading) return;

    setMinTimePassed(false);
    const t = setTimeout(() => setMinTimePassed(true), MIN_SKELETON_MS);

    return () => clearTimeout(t);
  }, []);

  const showSkeleton = loading || !minTimePassed;

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
    </div>
  );
}
