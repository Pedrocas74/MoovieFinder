import styles from "../styles/MovieList.module.css";
import MovieCard from "./MovieCard.jsx";

export default function MovieList({
  movies,
  onMovieClick,
  toggleFavorite,
  favorites,
  showFavorites,
  isTouchDevice,
}) {
  if ((!movies || movies.length === 0) && !showFavorites) {
    return <p>No movies found. Try another search.</p>;
  }

  return (
    <div className={styles.movieRow}>
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
        />
      ))}
    </div>
  );
}
