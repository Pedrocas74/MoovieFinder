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
    <div
      className={styles.movieRow}
      style={{
        backgroundColor: darkMode ? "#b032eb" : "#8f1919",
        scrollbarColor,
        borderTop: darkMode ? "4px double #1d1814" : "4px double #f5f5e9",
        borderBottom: darkMode ? "4px double #1d1814" : "4px double #f5f5e9",
      }}
    >
      {movies.map((movie) => (
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
  );
}
