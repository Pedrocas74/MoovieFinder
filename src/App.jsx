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
  const [showFavorites, setShowFavorites] = useState(false);

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

  // ✅ Hide loader only after React has rendered new movies or error
  useEffect(() => {
    if (searched || error) {
      setLoading(false);
    }
  }, [movies, error]);

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
      <Header toggleFavorites={() => setShowFavorites((prev) => !prev)} />

      {/* search text input from user strictly equall */}
      <SearchBar
        setMovies={setMovies}
        setLoading={setLoading}
        setError={setError}
      />

      {loading && (
        <p className="loading-animation">
          SEARCHING...
        </p>
      )}

      {error && <p>{error}</p>}
      {/* ✅ Movies found → show results.
      ❌ No results → “No movies found” message.
      🚨 API/network issue → “Unable to fetch.” */}

      {showFavorites && ( //movieList from FAVORITES
        <section className="favorites-section"> 
          <h2>My Favorites ❤️</h2>
          <MovieList
            movies={favorites}
            onMovieClick={setSelectedMovie}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        </section>
      )}

      {!loading && searched && ( //movieList from SEARCH
        <MovieList 
          movies={movies} 
          onMovieClick={setSelectedMovie}
          toggleFavorite={toggleFavorite}
        />
      )}

      {selectedMovie && (
        <MovieSummary
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
