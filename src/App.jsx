import "./App.css";

import { useState, useEffect } from "react";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
// import MovieCard from "./components/MovieCard.jsx";
import MovieSummary from "./components/MovieSummary.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
});
 
const searched = movies.length > 0;

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Save favorites whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

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
      
      <h2>Favorites ❤️</h2>
      <MovieList 
        movies={favorites} 
        onMovieClick={setSelectedMovie} 
        toggleFavorite={toggleFavorite} 
        favorites={favorites || []} />

      {searched && <MovieList movies={movies} onMovieClick={setSelectedMovie} />}

      {selectedMovie && (
        <MovieSummary movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

    </div>
  );
}
