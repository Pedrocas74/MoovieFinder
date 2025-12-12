import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../../components/movie/MovieList";
import {
  getTrending,
  getNowInTheathers,
  getUpcoming,
  getPopular,
} from "../../services/tmdb";

export default function Home({
  searchedMovies,
  setSearchedMovies,
  error,
  setError,
  loading,
  setLoading,
}) {
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);

  const navigate = useNavigate();
  const isSearched = searchedMovies.length > 0;

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  // hide loader after search results render
  useEffect(() => {
    if (isSearched || error) setLoading(false);
  }, [isSearched, error, setLoading]);

  //loader with partial success
  useEffect(() => {
    let cancelled = false;

    async function loadHomeMovies() {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        getTrending(),
        getNowInTheathers(),
        getUpcoming(),
        getPopular(),
      ]);

      if (cancelled) return;

      const [tr, nt, up, pop] = results;

      if (tr.status === "fulfilled")
        setTrending(tr.value.results ?? tr.value);

      if (np.status === "fulfilled")
        setNowPlaying(np.value.results ?? np.value);

      if (up.status === "fulfilled")
        setUpcoming(up.value.results ?? up.value);

      if (pop.status === "fulfilled")
        setPopular(pop.value.results ?? pop.value);

      //show a soft error if anything failed
      if (results.some((r) => r.status === "rejected")) {
        setError("Some sections failed to load.");
      }

      setLoading(false);
    }

    loadHomeMovies();

    return () => {
      cancelled = true;
    };
  }, [setError, setLoading]);

  return (
    <>
      {isSearched && (
        <MovieList
          title="Search results"
          movies={searchedMovies}
          layout="grid"
          onMovieClick={handleOpenDetails}
        />
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
