import Skeleton from "@mui/material/Skeleton";
import SkeletonMovieList from "../../components/movie/MovieList/SkeletonMovieList";
import styles from "./PersonDetails.module.css";

export default function SkeletonPersonDetails() {
  return (
    <section className={styles.page}>
      <div className={styles.mainContainer}>
        <div className={styles.imgContainer}>
          <Skeleton
            variant="rectangular"
            className={styles.avatar}
            style={{ marginTop: "1rem" }}
            width="clamp(200px, 20vw, 350px)"
            height="auto"
          />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.detailsContainer}>
            <Skeleton
              variant="text"
              width="50%"
              height={40}
              style={{ margin: "var(--pd-title)" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "5%",
                marginBottom: "0.7rem",
              }}
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton
                variant="text"
                width={100}
                height={16}
                style={{ marginLeft: 7 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "5%",
                marginBottom: "1rem",
              }}
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton
                variant="text"
                width={150}
                height={16}
                style={{ marginLeft: 7 }}
              />
            </div>
          </div>
          <div className={styles.bioContainer} style={{ border: "3px inset var(--clr-primary)"}}>
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton
              variant="text"
              width={80}
              height={40}
              style={{ marginTop: "1rem" }}
            />
          </div>
        </div>
      </div>
      <SkeletonMovieList title layout="row" count={10} />
    </section>
  );
}
