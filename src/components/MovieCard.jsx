import styles from "../styles/MovieCard.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";
import { useState } from "react";

export default function MovieCard({
  movie,
  onClick,
  toggleFavorite,
  isFavorite,
  isTouchDevice,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  // Handle swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 100) {
      // swipe up
      toggleFavorite(movie);
      setShowFeedback(true);

      // hide after 1s
      setTimeout(() => setShowFeedback(false), 1000);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className={styles.movieCard}
      onClick={onClick}
      onTouchStart={isTouchDevice ? handleTouchStart : undefined}
      onTouchMove={isTouchDevice ? handleTouchMove : undefined}
      onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
    >
      <img src={posterUrl} alt={movie.title} />
      <div className={styles.movieText}>
        <h3>{movie.title}</h3>
        <div className={styles.dateAndRate}>
          <p className={styles.releaseDate}>
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
          <p className={styles.rating}>
            ⭐ {Number(movie.vote_average).toFixed(1)}
          </p>

          {!isTouchDevice && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(movie);
              }}
            >
              {isFavorite ? "💔 Remove" : "❤️ Favorite"}
            </button>
          )}
        </div>
      </div>

      {/* feedback animation */}
      {showFeedback && (
        <div className={styles.feedback}>{isFavorite ? "💔" : "❤️"}</div>
      )}
    </div>
  );
}
