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
//icons
import { X } from "lucide-react";
//animation
import { AnimatePresence, motion } from "framer-motion";

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

  const searched = movies.length > 0;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  //DARK MODE TOGGLE
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
      <div className="app-flex">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleFavorites={() => setShowFavorites((prev) => !prev)}
        />
        <div className="search-container">
          <AnimatePresence mode="wait">
          {!searched ? (
            <motion.p /*1ST*/
              key="intro"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              exit={{ y: 10, opacity: 0}}
              transition={{ ease: "easeIn" }}
              className="introduction"
              role="status"
              aria-live="polite"
            >
              Type a title, find a movie.
            </motion.p>
          
          ) : (
            <section className="title-container">
              <motion.h1
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeIn", delay: 1.5 }}
              >
                Search. Find. Save.
              </motion.h1>
            </section>
          )}
          </AnimatePresence>

          <SearchBar
            setMovies={setMovies}
            setLoading={setLoading}
            setError={setError}
            darkMode={darkMode}
          />

          <motion.p /*2ND*/
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: searched ? 0.7 : 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, ease: "easeIn" }}
            className="guide"
          >
            {isTouchDevice ? (
              <>
                To add a movie to favorites, <strong>swipe up the card.</strong>
              </>
            ) : (
              <>
                To add a movie to favorites,{" "}
                <strong>click the heart icon.</strong>
              </>
            )}
          </motion.p>
        </div>

        <div className="movies-section">
          <div className="errorLoading-container">
            {error && (
              <p
                className="error-message"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="loading-animation">
              {loading && <LoadingSVG darkMode={darkMode} />}
            </div>
          </div>

          {/*Movies found -> show results
         No results -> “No movies found” message
         API/network issue -> “Unable to fetch” */}

          {!loading &&
            searched && ( //movieList from SEARCH
              <div className="movies-container">
                <MovieList
                  movies={movies}
                  onMovieClick={setSelectedMovie}
                  toggleFavorite={toggleFavorite}
                  isTouchDevice={isTouchDevice}
                  darkMode={darkMode}
                />
              </div>
            )}
        </div>

        <Footer darkMode={darkMode} />

        {showFavorites && ( //movieList from FAVORITES
          <aside
            className="favorites-page"
            aria-labelledby="favorites-title"
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

        {selectedMovie && ( //after a click in one movie
          <MovieSummary
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            darkMode={darkMode}
          />
        )}
      </div>
    </>
  );
}
