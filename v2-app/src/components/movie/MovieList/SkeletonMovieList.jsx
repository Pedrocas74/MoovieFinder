import styles from "./MovieList.module.css";
//dependencies 
import Skeleton from "@mui/material/Skeleton";
//custom components 
import SkeletonMovieCard from "../MovieCard/SkeletonMovieCard";

export default function SkeletonMovieList({
  title,
  layout = "row",
  count = 10,
}) {
  return (
    <section className={styles.movieList}>
      {title && (
        <Skeleton
          variant="text"
          width={150}
          height={32}
          style={{ margin: "var(--pd-title)" }}
        />
      )}
      <div className={styles[layout]}>
        {Array.from({ length: count }, (_, i) => (
          <SkeletonMovieCard key={i} />
        ))}
      </div>
    </section>
  );
}
