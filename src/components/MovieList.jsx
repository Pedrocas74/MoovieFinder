import styles from "../styles/MovieList.module.css";
import MovieCard from "./MovieCard.jsx";


export default function MovieList({ movies, onMovieClick }) {
  return (
    <div
      className={styles.movieGrid}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${movies.length}, 1fr)`,
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
      ))}
    </div>
  );
}
