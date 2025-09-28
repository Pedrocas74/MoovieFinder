import styles from '../styles/MovieSummary.module.css';
import placeholderImg from "/assets/placeholder_movie.webp";

export default function MovieSummary({ movie, onClose }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>✖</button>
        <img src={posterUrl} alt={movie.title} />
        <h2>{movie.title}</h2>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>
      </div>
    </div>
  );
}