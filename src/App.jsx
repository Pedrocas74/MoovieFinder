//style
import "./App.css";
//hooks
import { useState, useEffect } from "react";
//components
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieSummary from "./components/MovieSummary.jsx";
import Footer from "./components/Footer.jsx";
import LoadingSVG from "./components/LoadingSVG.jsx";
import InitializationPage from "./components/InitializationPage.jsx";
//icons
import { X } from "lucide-react";
//animation
import { motion, AnimatePresence } from "framer-motion";

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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [initialized, setInitialized] = useState(false);

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
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
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
    <>
      <div //to avoid scrollbar
        style={{
          position: "fixed", 
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden", 
          zIndex: -1, 
        }}
      >
        <AnimatePresence>
          {!initialized && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InitializationPage onFinish={() => setInitialized(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {initialized && (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="app-flex"
        >
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            toggleFavorites={() => setShowFavorites((prev) => !prev)}
          />

          <div className="search-container">
            {!searched && (
              <p className="introduction" role="status" aria-live="polite">
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
            <div className="loading-animation">
              {loading && <LoadingSVG darkMode={darkMode} />}
            </div>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            {/*Movies found -> show results
         No results -> “No movies found” message
         API/network issue -> “Unable to fetch” */}
          </div>

          {showFavorites && ( //movieList from FAVORITES
            <aside
              className="favorites-page"
              aria-labelledby="favorites-title"
              style={{ backgroundColor: darkMode ? "#1d1814" : "#f5f5e9" }}
            >
              <section className="favorites-section">
                <h2 id="favorites-title">
                  {darkMode ? "My Favorites 🤍" : "My Favorites ❤️"}
                </h2>
                <div className="fav-container">
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

                  <p
                    className="favorites-guide"
                    style={{ top: favorites.length === 0 ? "10vh" : null }}
                  >
                    {favorites.length === 0 ? (
                      "Search for movies and add them to your Favorites."
                    ) : (
                      <>
                        To remove a movie from favorites,{" "}
                        <strong>
                          {isTouchDevice
                            ? "swipe up the card."
                            : "tap the heart icon."}
                        </strong>
                      </>
                    )}
                  </p>
                </div>
                <button
                  className="buttonX"
                  aria-label="Close favorites"
                  onClick={() => setShowFavorites(false)}
                >
                  <X style={{ scale: 0.9, strokeWidth: 4 }} />
                </button>
              </section>
            </aside>
          )}
          <div className="movies-container">
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
                  <p className="guide">
                    {isTouchDevice ? (
                      <>
                        To add a movie to favorites,{" "}
                        <strong>swipe up the card.</strong>
                      </>
                    ) : (
                      <>
                        To add a movie to favorites,{" "}
                        <strong>click the heart icon.</strong>
                      </>
                    )}
                  </p>
                </>
              )}
          </div>
          {selectedMovie && ( //after a click in one movie
            <MovieSummary
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              darkMode={darkMode}
            />
          )}

          <Footer darkMode={darkMode} />
        </motion.div>
      )}
    </>
  );
}
