import SearchBar from "../../components/layout/SearchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MovieList from "../../components/movie/MovieList";

export default function Home() {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSearched = searchedMovies.length > 0;
  // Hide loader only after React has rendered new movies or error
  useEffect(() => {
    if (isSearched || error) {
      setLoading(false);
    }
  }, [searchedMovies, error]);

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie }});
  };

  return (
    <>
      <SearchBar
        setSearchedMovies={setSearchedMovies}
        setLoading={setLoading}
        setError={setError}

      />

      {isSearched && (
        <MovieList
          title="Search results"
          movies={searchedMovies}
          layout="grid"
          onMovieClick={handleOpenDetails}
        />
      )}
    </>
  );
}
