import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getMovieDetails,
  getMovieImages,
  getCredits,
} from "../../services/tmdb";
// import LoadingSVG from "../../components/ui/LoadingSVG";
import styles from "./MovieDetails.module.css";
import {
  backdropUrl,
  logoUrl,
  screenshotUrl,
  profileUrl,
} from "../../services/tmdbImages";

import { Star, Hourglass, Calendar, User } from "lucide-react";

export default function MovieDetails() {
  const [logoPath, setLogoPath] = useState(null);
  const [credits, setCredits] = useState(null);

  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movie details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!movie || movie.runtime == null) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const images = await getMovieImages(movie.id);

        const bestLogo =
          images.logos?.find((l) => l.iso_639_1 === "en") ??
          images.logos?.find((l) => l.iso_639_1 == null) ??
          images.logos?.[0];

        setLogoPath(bestLogo?.file_path ?? null);
      } catch (e) {
        console.error("Logo fetch failed:", e);
        setLogoPath(null);
      }
    })();
  }, [movie?.id]);

  useEffect(() => {
    if (!movie?.id) return;

    (async () => {
      try {
        const data = await getCredits(movie.id);
        setCredits(data);
      } catch (e) {
        console.error("Credits fetch failed", e);
      }
    })();
  }, [movie?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  const director = credits?.crew?.find((person) => person.job === "Director");
  const writers = credits?.crew?.filter((person) =>
    ["Writer", "Screenplay", "Story"].includes(person.job)
  );
  const cast = credits?.cast?.slice(0, 7) ?? []; //top 7 actors

  // const openPerson = (person) => {
  //   navigate(`/person/${person.id}`, { state: { person } });
  // };

  return (
    <section className={styles.movieDetailsPage}>
      <div className={styles.backdropWrapper}>
        <img
          src={backdropUrl(movie.backdrop_path, "w780")}
          srcSet={`
    ${backdropUrl(movie.backdrop_path, "w780")} 780w,
    ${backdropUrl(movie.backdrop_path, "w1280")} 1280w,
    ${backdropUrl(movie.backdrop_path, "original")} 2000w
  `}
          sizes="(max-width: 768px) 780px, 1280px"
          alt={movie.title}
          className={styles.backdrop}
        />

        {logoPath && (
          <img
            src={logoUrl(logoPath, "w300")}
            srcSet={`
      ${logoUrl(logoPath, "w154")} 154w,
      ${logoUrl(logoPath, "w300")} 300w,
      ${logoUrl(logoPath, "w500")} 500w,
      ${logoUrl(logoPath, "original")} 1000w
    `}
            sizes="
      (max-width: 480px) 55vw,
      (max-width: 768px) 45vw,
      (max-width: 1200px) 35vw,
      420px
    "
            alt={`${movie.title} logo`}
            className={styles.logo}
            loading="eager"
            decoding="async"
          />
        )}
      </div>
      <ul className={styles.itemsContainer}>
        <li>
          <Hourglass style={{ marginRight: 5 }} size={11} />{" "}
          {movie.runtime ? `${movie.runtime} min` : "N/A"}
        </li>
        <li>
          <Calendar style={{ marginRight: 5 }} size={11} />{" "}
          {movie.release_date.split("-")[0]}
        </li>
        <li>
          <Star style={{ marginRight: 5 }} size={11} />
          {Number(movie.vote_average).toFixed(1)}
          <span>({movie.vote_count})</span>
        </li>
      </ul>
      <p className={styles.overview}>{movie.overview}</p>
      {/* <p>Release Date: {movie.release_date ? movie.release_date : "N/A"}</p> */}

      {/* GENRES  */}
      {movie.genres?.length > 0 && (
        <div className={styles.genres}>
          {movie.genres.map((genre) => (
            <span key={genre.id} className={styles.genre}>
              {genre.name}
            </span>
          ))}
        </div>
      )}

      {/* CASTING DETAILS  */}
      <dl className={styles.metaList}>
  {director && (
    <>
      <dt>Director</dt>
      <dd>
        <Link to={`/person/${director.id}`} id="navLinks" className={styles.personLink}>
          {director.name}
        </Link>
      </dd>
    </>
  )}

  {writers?.length > 0 && (
    <>
      <dt>Writers</dt>
      <dd>
        {writers.map((w, i) => (
          <span key={w.id}>
            <Link to={`/person/${w.id}`} id="navLinks" className={styles.personLink}>
              {w.name}
            </Link>
            {i < writers.length - 1 && ", "}
          </span>
        ))}
      </dd>
    </>
  )}

  {cast?.length > 0 && (
    <>
      <dt>Cast</dt>
      <dd>
        {cast.map((c, i) => (
          <span key={c.id}>
            <Link to={`/person/${c.id}`} id="navLinks" className={`${styles.personLink} ${styles.cast}`}>
              {c.name}
            </Link>
            {i < cast.length - 1 && <br/>}
          </span>
        ))}
      </dd>
    </>
  )}
</dl>

    </section>
  );
}
