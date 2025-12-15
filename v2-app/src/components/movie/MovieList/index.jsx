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
        {movies.map((movie, index) => {
          const key = `movielist-${title || "untitled"}-${movie.id}`;

          // Debug: Check for duplicate keys within this list
          const duplicateInList =
            movies.findIndex(
              (m, i) =>
                i !== index &&
                `movielist-${title || "untitled"}-${m.id}` === key
            ) !== -1;

          if (duplicateInList) {
            console.warn(`Duplicate key in ${title}:`, key, movie.title);
          }

          return <MovieCard key={key} movie={movie} onClick={onMovieClick} />;
        })}
      </div>
    </section>
  );
}
