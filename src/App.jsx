import "./App.css";

import { useState, useEffect } from "react";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieSummary from "./components/MovieSummary.jsx";
import Footer from "./components/Footer.jsx";
import LoadingSVG from "./components/LoadingSVG.jsx";

import { X } from "lucide-react";

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
  const [darkMode, setDarkMode] = useState(false);
  const searched = movies.length > 0;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;


  // DARK MODE TOGGLE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);



  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Save favorites whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Hide loader only after React has rendered new movies or error
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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} toggleFavorites={() => setShowFavorites((prev) => !prev)} />

      {!searched && (
        <p className="introduction">
          Type a title, find a movie — <strong>it’s that simple.</strong>
        </p>
      )}

      {/* search text input from user strictly equall */}
      <SearchBar
        setMovies={setMovies}
        setLoading={setLoading}
        setError={setError}
        darkMode={darkMode}
      />
      <div className="loading-animation">{loading && <LoadingSVG darkMode={darkMode} />}</div>

      {error && <p>{error}</p>}
      {/*Movies found -> show results
         No results -> “No movies found” message
         API/network issue -> “Unable to fetch” */}

      {showFavorites && ( //movieList from FAVORITES
        <div className="favorites-page" style={{backgroundColor: darkMode ? "#1d1814" : "#f5f5e9" }}>
          <section className="favorites-section">
            <h2>My Favorites ❤️</h2>
            {favorites.length !== 0 && (
              <MovieList
                movies={favorites}
                onMovieClick={setSelectedMovie}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                showFavorites={showFavorites}
                isTouchDevice={isTouchDevice}
                darkMode={darkMode}
              />
            )}
            {isTouchDevice && (
              <p className="favorites-guide">
                {favorites.length === 0 ? (
                  "Search for movies and add them to your Favorites."
                ) : (
                  <>
                    To remove a movie from favorites,{" "}
                    <strong>swipe up the card.</strong>
                  </>
                )}
              </p>
            )}
            <button onClick={() => setShowFavorites(false)}>
              <X style={{ scale: 0.9, strokeWidth: 4 }} />
            </button>
          </section>
        </div>
      )}

      {!loading &&
        searched && ( //movieList from SEARCH
          <>
          <MovieList
            movies={movies}
            onMovieClick={setSelectedMovie}
            toggleFavorite={toggleFavorite}
            isTouchDevice={isTouchDevice}
            darkMode={darkMode}
          />
          <p className="guide">To add a movie to favorites, <strong>swipe up the card.</strong></p>
          </>
        )}

      {selectedMovie && ( //after a click in one movie
        <MovieSummary
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          darkMode={darkMode}
        />
      )}

      <Footer darkMode={darkMode} />
    </div>
  );
}
