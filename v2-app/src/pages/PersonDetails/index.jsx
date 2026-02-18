import styles from "./PersonDetails.module.css";
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonMovieCredits } from "../../services/tmdb";
import { profileUrl } from "../../services/tmdbImages";
import MovieList from "../../components/movie/MovieList";
import SkeletonPersonDetails from "./SkeletonPersonDetails";
import ErrorPlaceholder from "../../components/feedback/ErrorPlaceholder";

import CakeIcon from "@mui/icons-material/Cake";
import CottageIcon from "@mui/icons-material/Cottage";

export default function PersonDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [person, setPerson] = useState(location.state?.person || null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(!person);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); //to open biography extra info

  useEffect(() => { //fetch person's details 
    (async () => {
      try {
        setLoading(true);
        const p = await getPersonDetails(id);
        setPerson(p);
        setError(null);
      } catch (e) {
        setError("Failed to load person details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => { //fetch person's "known for" movielist
    (async () => {
      try {
        const c = await getPersonMovieCredits(id);
        setCredits(c);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const knownFor =
    credits?.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 20) ??
    []; //sort by popularity descendent

  if (loading) return <SkeletonPersonDetails />;
  if (error) {
    return (
      <ErrorPlaceholder
        type="network"
        title="Couldn’t load person"
        message="We had trouble fetching this person’s details."
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  if (!person) { //missing information fallback UI
    return (
      <ErrorPlaceholder
        type="not-found"
        title="Person not found"
        message="This person may not exist or the link is incorrect."
        actionLabel="Go back"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.mainContainer}>
        {person.profile_path ? (
          <div className={styles.imgContainer}>
            <img
              src={profileUrl(person.profile_path, "w342")}
              srcSet={`
    ${profileUrl(person.profile_path, "w92")} 92w,
    ${profileUrl(person.profile_path, "w185")} 185w,
    ${profileUrl(person.profile_path, "w342")} 342w,
    ${profileUrl(person.profile_path, "original")} 700w
  `}
              sizes="
    (max-width: 480px) 120px,
    (max-width: 768px) 160px,
    (max-width: 1200px) 250px,
    350px
  "
              alt={person.name}
              className={styles.avatar}
              loading="eager"
              decoding="async"
            />
          </div>
        ) : (
          <div className={styles.imgContainer}>
            <img
              src="/images/avatarPlaceholder.png"
              className={styles.avatar}
              alt={`Photo of ${person.name} not found`}
              loading="eager"
              decoding="async"
              role="img"
              aria-label={`${person.name} profile photo unavailable`}
            />
          </div>
        )}

        <div className={styles.textContainer}>
          <div className={styles.detailsContainer}>
            <h2>{person.name}</h2>
            {person.birthday && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "5%",
                  marginBottom: "0.7rem",
                }}
              >
                <CakeIcon
                  sx={{ color: "var(--clr-border)" }}
                  aria-hidden="true"
                  focusable="false"
                />
                <time
                  style={{ paddingLeft: 7 }}
                  className={styles.birthday}
                  dateTime={person.birthday}
                >
                  {person.birthday.split("-").reverse().join("-")}
                </time>
              </div>
            )}
            {person.place_of_birth && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "5%",
                  marginBottom: "1rem",
                }}
              >
                <CottageIcon
                  sx={{ color: "var(--clr-border)" }}
                  aria-hidden="true"
                  focusable="false"
                />
                <span
                  style={{ paddingLeft: 7 }}
                  className={styles.placeOfBirth}
                >
                  {person.place_of_birth}
                </span>
              </div>
            )}
          </div>

          {person.biography && (
            <div className={styles.bioContainer}>
              <p
                id="person-bio"
                className={`${styles.bio} ${!isOpen ? styles.clamped : ""}`}
              >
                {person.biography}
              </p>

              {person.biography.length > 100 && (
                <button
                  type="button"
                  className={`${styles.toggleBio} btnSecondary`}
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                  aria-controls="person-bio"
                >
                  {isOpen ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {knownFor.length > 0 && (
        <>
          <h3>Known for:</h3>
          <MovieList
            movies={knownFor}
            layout="row"
            onMovieClick={(movie) => navigate(`/movie/${movie.id}`)}
          />
        </>
      )}
    </section>
  );
}
