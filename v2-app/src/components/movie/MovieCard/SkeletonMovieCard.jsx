import Skeleton from "@mui/material/Skeleton";
import styles from "./MovieCard.module.css";

export default function SkeletonMovieCard() {
  return (
    <div className={styles.movieCard}>
      <div className={styles.skeletonImg}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
      <div className={styles.dateAndRate}>
        <Skeleton variant="text" width={40} height={16} />
        <Skeleton variant="text" width={30} height={16} />
      </div>
    </div>
  );
}
