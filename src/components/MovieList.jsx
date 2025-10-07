import { useState, useMemo } from "react";
import styles from "../styles/MovieList.module.css";
import MovieCard from "./MovieCard.jsx";

export default function MovieList({
  movies,
  onMovieClick,
  toggleFavorite,
  favorites,
  showFavorites,
  isTouchDevice,
  darkMode,
}) {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const sortedMovies = useMemo(() => {
    if (!movies) return [];

    const moviesCopy = [...movies]; // avoid mutating original

    switch (filter) {
      case "recent":
        return moviesCopy.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      case "oldest":
        return moviesCopy.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
      case "mostRated":
        return moviesCopy.sort((a, b) => b.vote_average - a.vote_average);
      case "lowestRated":
        return moviesCopy.sort((a, b) => a.vote_average - b.vote_average);
      case "crescent":
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
      case "decrescent":
        return moviesCopy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return moviesCopy;
    }
  }, [movies, filter]);

  if ((!movies || movies.length === 0) && !showFavorites) {
    return (
      <p role="status" aria-live="polite">
        No movies found. Try another search.
      </p>
    );
  }

  const scrollbarColor = isTouchDevice
    ? darkMode
      ? "#1d1814 #1d1814"
      : "#f5f5e9 #f5f5e9"
    : darkMode
    ? "#b032eb #1d1814"
    : "#8f1919 #f5f5e9";

  return (
    <>
      <div className={styles.filters}>
        <label htmlFor="filters"></label>

        <select
          name="orders"
          id="filters"
          value={filter}
          onChange={handleFilterChange}
          className={`${styles.dropdown} ${darkMode ? styles.dark : ""}`}
          aria-label="Choose how to sort the movie list"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFilterChange(e);
            if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault(); 
          }}
        >
          <option value="">--Order--</option>
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest</option>
          <option value="mostRated">Most rated</option>
          <option value="lowestRated">Lowest rated</option>
          <option value="crescent">A-Z</option>
          <option value="decrescent">Z-A</option>
        </select>
      </div>
      <div
        className={styles.movieRow}
        style={{
          backgroundColor: darkMode ? "#b032eb" : "#8f1919",
          scrollbarColor,
          borderTop: darkMode ? "4px double #1d1814" : "4px double #f5f5e9",
          borderBottom: darkMode ? "4px double #1d1814" : "4px double #f5f5e9",
        }}
      >
        {sortedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick(movie)}
            toggleFavorite={toggleFavorite}
            isFavorite={
              Array.isArray(favorites) &&
              favorites.some((fav) => fav.id === movie.id)
            }
            isTouchDevice={isTouchDevice}
            darkMode={darkMode}
            showFavorites={showFavorites}
          />
        ))}
      </div>
    </>
  );
}
