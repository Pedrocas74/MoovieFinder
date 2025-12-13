import { useNavigate } from "react-router-dom";
import MovieList from "../../components/movie/MovieList";
import { useHomeMovies } from "../../hooks/useHomeMovies";

export default function Home({ searchedMovies }) {
  const navigate = useNavigate();
  const isSearched = searchedMovies.length > 0;

  const { trending, nowPlaying, upcoming, popular, loading, error, reload } =
    useHomeMovies();

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <>
      {/* {isSearched && (
        <MovieList
          title="Search results"
          movies={searchedMovies}
          layout="grid"
          onMovieClick={handleOpenDetails}
        />
      )} */}

      {error && (
        <div>
          {error} <button onClick={reload}>Retry</button>
        </div>
      )}

      {trending.length > 0 && (
        <MovieList
          title="Trending"
          movies={trending}
          layout="row"
          onMovieClick={handleOpenDetails}
        />
      )}

      {nowPlaying.length > 0 && (
        <MovieList
          title="Now Playing"
          movies={nowPlaying}
          layout="row"
          onMovieClick={handleOpenDetails}
        />
      )}

      {upcoming.length > 0 && (
        <MovieList
          title="Upcoming"
          movies={upcoming}
          layout="row"
          onMovieClick={handleOpenDetails}
        />
      )}

      {popular.length > 0 && (
        <MovieList
          title="Popular"
          movies={popular}
          layout="row"
          onMovieClick={handleOpenDetails}
        />
      )}
    </>
  );
}
