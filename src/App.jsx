import "./App.css";

import { useState } from "react";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieSummary from "./components/MovieSummary.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const searched = movies.length > 0;

  return (
    <div className="app-flex">
      {/* logo + dark mode toogle */}
      <Header /> 

      {/* search text input from user strictly equall */}
      <SearchBar
        setMovies={setMovies}
        setLoading={setLoading}
        setError={setError}
      />

      {/* {loading && <Loading />}
      {error && <Error message={error} />} */}

      {searched && <MovieList movies={movies} onMovieClick={setSelectedMovie} />}

      {selectedMovie && (
        <MovieSummary movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

    </div>
  );
}
