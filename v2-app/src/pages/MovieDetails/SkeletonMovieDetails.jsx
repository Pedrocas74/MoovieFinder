import Skeleton from "@mui/material/Skeleton";
import styles from "./MovieDetails.module.css";

export default function SkeletonMovieDetails() {
  return (
    <section className={styles.movieDetailsPage}>
      <div className={styles.backdropWrapper}>
        <div className={styles.actionButtons}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="circular" width={42} height={42} />
          ))}
        </div>
        <Skeleton variant="rectangular" width="100%" height="100%" />
        <Skeleton
          variant="text"
          width="40%"
          height={60}
          style={{ position: "absolute", left: "5%", bottom: "10%" }}
        />
      </div>

      <ul className={styles.itemsContainer}>
        <li>
          <Skeleton variant="text" width={80} height={20} />
        </li>
        <li>
          <Skeleton variant="text" width={60} height={20} />
        </li>
        <li>
          <Skeleton variant="text" width={70} height={20} />
        </li>
      </ul>

      <Skeleton
        variant="text"
        width="90%"
        height={24}
        style={{ margin: "0 5%" }}
      />
      <Skeleton
        variant="text"
        width="85%"
        height={24}
        style={{ margin: "0 5%" }}
      />
      <Skeleton
        variant="text"
        width="80%"
        height={24}
        style={{ margin: "0 5%" }}
      />

      <div className={styles.genres}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={100} height={32} />
        ))}
      </div>

      <dl className={styles.metaList}>
        <dt>Director</dt>
        <dd>
          <Skeleton variant="text" width={150} height={24} />
        </dd>
        <dt>Writers</dt>
        <dd>
          <Skeleton variant="text" width={200} height={24} />
        </dd>
        <dt>Cast</dt>
        <dd>
          <Skeleton variant="text" width={250} height={24} />
        </dd>
      </dl>

      <section className={styles.screenshotsSection}>
        <Skeleton
          variant="text"
          width={180}
          height={34}
          style={{ margin: "7vh 0 2vh 0" }}
        />
        <div className={styles.screenshotsRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={240}
              height={160}
              style={{ borderRadius: "var(--radius-small)" }}
            />
          ))}
        </div>
      </section>

      <Skeleton
        variant="text"
        width={220}
        height={34}
        style={{ margin: "var(--pd-title)" }}
      />
      <div style={{ display: "flex", gap: "0.7rem", overflowX: "auto" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ flexShrink: 0 }}>
            <Skeleton variant="rectangular" width={150} height={225} />
            <Skeleton
              variant="text"
              width={120}
              height={16}
              style={{ marginTop: 8 }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
