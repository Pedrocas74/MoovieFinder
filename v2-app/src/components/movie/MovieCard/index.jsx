import placeholder_cover from "/images/placeholder_movie.webp";
import styles from "./MovieCard.module.css";
import { Star } from "lucide-react";

export default function MovieCard({ movie, onClick }) {
  return (
    <div className={styles.movieCard} onClick={() => onClick?.(movie)}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : placeholder_cover
        }
        alt={movie.title}
        onError={(e) => {
          e.target.onerror = null; //prevent infinite loop
          e.target.src = placeholder_cover;
        }}
      />

      <h3>{movie.title}</h3>
      <div className={styles.dateAndRate}>
        <p className={styles.releaseDate}>{movie.release_date?.slice(0, 4)}</p>
        <p className={styles.rating}>
          <Star size={10} /> {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>
    </div>
  );
}
