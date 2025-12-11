import MovieCard from "../MovieCard";
import styles from "./MovieList.module.css";

export default function MovieList({
  title,
  movies,
  layout,   
  onMovieClick,
  emptyMessage = "No movies to show.",
}) {
  if (!movies || movies.length === 0) {
    return (
      <section className={styles.emptyList}>
        {title && <h2>{title}</h2>}
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.movieList}>
      {title && <h2>{title}</h2>}
      <div className={styles[layout]}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
}
