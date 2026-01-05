import placeholder_cover from "/images/placeholder_movie.webp";
import styles from "./MovieCard.module.css";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from  "../../../context/LibraryContext";


import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";



export default function MovieCard({ movie, onClick }) {
  const { isWatched, isInWatchlist, isFavorite } = useLibrary();
  const isSaved =
    isWatched(movie.id) || isInWatchlist(movie.id) || isFavorite(movie.id);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.movieCard} ${isSaved ? styles.saved : ""}`}
      onClick={() => onClick?.(movie)}
    >
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

      {/* {isSaved && (
        <div>

        </div>
      )} */}

      <div className={styles.dateAndRate}>
        <p className={styles.releaseDate}>{movie.release_date?.slice(0, 4)}</p>
        <p className={styles.rating}>
          <Star size={10} /> {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>
    </motion.div>
  );
}
