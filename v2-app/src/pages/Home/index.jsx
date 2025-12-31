import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieList from "../../components/movie/MovieList";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import { useHomeMovies } from "../../hooks/useHomeMovies";
import { useRecentlyViewed } from "../../context/RecentlyViewed";

export default function Home() {
  const navigate = useNavigate();

  const { trending, nowPlaying, upcoming, loading, error, reload } =
    useHomeMovies();
  
  const { recent } = useRecentlyViewed();

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
    <>
      {error && (
        <div>
          {error} <button onClick={reload}>Retry</button>
        </div>
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
          />
        )
      )}

      {recent.length > 0 && (
        <MovieList
          title="Recently viewed"
          movies={recent}
          layout="row"
          onMovieClick={handleOpenDetails}
        />
      )}
    </>
  );
}
