import styles from "./MovieDetails.module.css";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getMovieDetails,
  getMovieImages,
  getCredits,
  getTrailer,
  getSimilarMovies,
  getRecommendedMovies
} from "../../services/tmdb";
// import LoadingSVG from "../../components/ui/LoadingSVG";

import { backdropUrl, logoUrl, screenshotUrl } from "../../services/tmdbImages";

import {
  Star,
  Hourglass,
  Calendar,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useLibrary } from "../../context/LibraryContext";
import { useRecentlyViewed } from "../../context/RecentlyViewed";

//tooltip
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
//Snackbar and Alert / toast
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import MovieList from "../../components/movie/MovieList/index";
import SkeletonMovieDetails from "./SkeletonMovieDetails";

export default function MovieDetails() {
  const [logoPath, setLogoPath] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false); //screenshots viewer
  const [activeShot, setActiveShot] = useState(0); //screenshot being displayed
  const [similar, setSimilar] = useState([]); 
  const [recommended, setRecommended] = useState([]);
  const [open, setOpen] = useState(false); //snackbar - toast

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState(null);

  const {
    toggleWatched,
    toggleWatchlist,
    toggleFavorite,
    isWatched,
    isInWatchlist,
    isFavorite,
  } = useLibrary();

  //reset movie state when id changes
  useEffect(() => {
    setMovie(location.state?.movie || null);
    setLoading(!location.state?.movie);
    setError(null);
  }, [id, location.state?.movie]);

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

    fetchMovie();
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
        setScreenshots((images.backdrops || []).slice(5, 17));
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

  async function handleWatchTrailer() {
    try {
      const data = await getTrailer(movie.id);

      const trailer =
        data?.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        ) || data?.results?.find((v) => v.site === "YouTube");

      if (!trailer) {
        setOpen(true);
        return;
      }
      setTrailerKey(trailer.key);
      setShowTrailer(true);
    } catch (e) {
      console.error(e);
    }
  }

  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (movie?.id) addRecentlyViewed(movie);
  }, [movie?.id, addRecentlyViewed]);

  const openLightbox = useCallback((index) => {
    setActiveShot(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevShot = useCallback(() => {
    setActiveShot((i) => (i - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  const nextShot = useCallback(() => {
    setActiveShot((i) => (i + 1) % screenshots.length);
  }, [screenshots.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevShot();
      if (e.key === "ArrowRight") nextShot();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, closeLightbox, prevShot, nextShot]);

  //recs are fetched and placed first, while sims are used as a filler
  useEffect(() => {
  if (!movie?.id) return;

  let cancelled = false;

  (async () => {
    try {
      const [recs, sims] = await Promise.all([
        getRecommendedMovies(movie.id, 1),
        getSimilarMovies(movie.id, 1),
      ]);

      const merged = [...(recs || []), ...(sims || [])]
        .filter((m) => m && m.id !== movie.id);

      //de-dupe by id, keeping first occurrence -> recs win
      const uniq = Array.from(new Map(merged.map((m) => [m.id, m])).values());

      if (!cancelled) setSimilar(uniq);
    } catch (e) {
      console.error("Similar/recommendations fetch failed", e);
      if (!cancelled) setSimilar([]);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [movie?.id]);


  if (loading) return <SkeletonMovieDetails />;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  const director = credits?.crew?.find((person) => person.job === "Director");
  const writers = credits?.crew?.filter((person) =>
    ["Writer", "Screenplay", "Story"].includes(person.job)
  );
  const cast = credits?.cast?.slice(0, 7) ?? [];
  const watched = isWatched(movie.id);
  const inWatchlist = isInWatchlist(movie.id);
  const favorite = isFavorite(movie.id);

  const AppTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    "& .MuiTooltip-tooltip": {
      backgroundColor: "var(--clr-primary)",
      fontSize: "var(--fs-sm)",
      padding: "var(--pd-button)",
      borderRadius: "var(--radius-button)",
    },
    "& .MuiTooltip-arrow": {
      color: "var(--clr-primary)",
    },
  });

  const handleOpenDetails = (m) => {
    navigate(`/movie/${m.id}`, { state: { movie: m } });
  };

  return (
    <section className={styles.movieDetailsPage}>
      <div className={styles.backdropWrapper}>
        <div className={styles.actionButtons}>
          <AppTooltip title="Play trailer" placement="left">
            <button
              className="actionButton"
              type="button"
              onClick={handleWatchTrailer}
            >
              <Play size={24} fill="var(--bg-ll)" stroke="transparent" />
            </button>
          </AppTooltip>

          <AppTooltip
            title={watched ? "Remove from watched" : "Add to watched"}
            placement="left"
          >
            <button
              className="actionButton"
              type="button"
              onClick={() => {
                toggleWatched(movie);
              }}
              aria-pressed={watched}
              title={watched ? "Remove from watched" : "Add to watched"}
              style={{ background: watched ? "var(--bg-l)" : "transparent" }}
            >
              {watched ? (
                <VisibilityIcon />
              ) : (
                <VisibilityOffOutlinedIcon sx={{ color: "var(--bg-ll)" }} />
              )}
            </button>
          </AppTooltip>

          <AppTooltip
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            placement="left"
          >
            <button
              className="actionButton"
              type="button"
              onClick={() => toggleWatchlist(movie)}
              aria-pressed={inWatchlist}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              style={{
                background: inWatchlist ? "var(--bg-l)" : "transparent",
              }}
            >
              {inWatchlist ? (
                <PlaylistAddCheckRoundedIcon />
              ) : (
                <PlaylistAddRoundedIcon sx={{ color: "var(--bg-ll)" }} />
              )}
            </button>
          </AppTooltip>

          <AppTooltip
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            placement="left"
          >
            <button
              className="actionButton"
              type="button"
              onClick={() => toggleFavorite(movie)}
              aria-pressed={favorite}
              title={favorite ? "Remove from favorites" : "Add to favorites"}
              style={{ background: favorite ? "var(--bg-l)" : "transparent" }}
            >
              {favorite ? (
                <FavoriteIcon sx={{ color: "var(--clr-primary)" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "var(--bg-ll)" }} />
              )}
            </button>
          </AppTooltip>
        </div>
        {movie.backdrop_path ? (
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
        ) : (
          <span className={styles.coverNotAvailable}>COVER NOT AVAILABLE</span>
        )}

        {logoPath ? (
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
        ) : (
          <h2 className={styles.title}>{movie.title}</h2>
        )}
      </div>
      <ul className={styles.itemsContainer}>
        <li>
          <Hourglass style={{ marginRight: 5 }} size={13} />{" "}
          {movie.runtime ? `${movie.runtime} min` : "N/A"}
        </li>
        <li>
          <Calendar style={{ marginRight: 5 }} size={13} />{" "}
          {movie.release_date.split("-")[0]}
        </li>
        <li>
          <Star style={{ marginRight: 5 }} size={13} />
          {Number(movie.vote_average).toFixed(1)}
          <span>({movie.vote_count})</span>
        </li>
      </ul>
      {movie.overview && <p className={styles.overview}>{movie.overview}</p>}
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
              <Link
                to={`/person/${director.id}`}
                id="navLinks"
                className={styles.personLink}
              >
                {director.name}
              </Link>
            </dd>
          </>
        )}

        {writers?.length > 0 && (
          <>
            <dt>Writers</dt>
            <dd className={styles.writers}>
              {writers.map((w, i) => (
                <span key={w.id}>
                  <Link
                    to={`/person/${w.id}`}
                    id="navLinks"
                    className={styles.personLink}
                  >
                    {w.name}
                  </Link>
                  {/* {i < writers.length - 1 && ", "} */}
                </span>
              ))}
            </dd>
          </>
        )}

        {cast?.length > 0 && (
          <>
            <dt>Cast</dt>
            <dd className={styles.cast}>
              {cast.map((c, i) => (
                <span key={c.id}>
                  <Link
                    to={`/person/${c.id}`}
                    id="navLinks"
                    className={`${styles.personLink} ${styles.cast}`}
                  >
                    {c.name}
                  </Link>
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>

      {screenshots.length > 0 && (
        <section className={styles.screenshotsSection}>
          <h3 className={styles.sectionTitle1}>Screenshots</h3>

          <div className={styles.screenshotsRow}>
            {screenshots.map((img, idx) => (
              <button
                key={img.file_path}
                type="button"
                className={`${styles.screenshotBtn} actionButton`}
                onClick={() => openLightbox(idx)}
                aria-label={`Open screenshot ${idx + 1} fullscreen`}
              >
                <img
                  src={screenshotUrl(img.file_path, "w780")}
                  alt={`${movie.title} screenshot ${idx + 1}`}
                  className={styles.screenshot}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {similar?.length > 0 && (
        <>
          <h3 className={styles.sectionTitle2}>Recommendations</h3>
          <MovieList
            // title="Similar movies"
            movies={similar.slice(0, 20)}
            layout="row"
            onMovieClick={handleOpenDetails}

          />
        </>
      )}

      {lightboxOpen && screenshots[activeShot] && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot viewer"
          onClick={closeLightbox}
        >
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close viewer"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              className={styles.lightboxNavLeft}
              onClick={prevShot}
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={20} />
            </button>

            <img
              className={styles.lightboxImg}
              src={screenshotUrl(screenshots[activeShot].file_path, "original")}
              alt={`${movie.title} screenshot ${activeShot + 1}`}
            />

            <button
              type="button"
              className={styles.lightboxNavRight}
              onClick={nextShot}
              aria-label="Next screenshot"
            >
              <ChevronRight size={20} />
            </button>

            <div className={styles.lightboxCounter}>
              {activeShot + 1} / {screenshots.length}
            </div>
          </div>
        </div>
      )}

      {showTrailer && (
        <div
          className={styles.trailerOverlay}
          onClick={() => setShowTrailer(false)}
        >
          <div
            className={styles.trailerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              <X size={20} color="white" />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {!showTrailer && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        >
          <Alert
            severity="info"
            sx={{
              backgroundColor: "var(--clr-primary)",
              color: "var(--clr-bg)",
              fontWeight: 600,
            }}
          >
            Trailer not available
          </Alert>
        </Snackbar>
      )}
    </section>
  );
}
