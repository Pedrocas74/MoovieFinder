import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonMovieCredits } from "../../services/tmdb";
import { profileUrl, posterUrl } from "../../services/tmdbImages";
import styles from "./PersonDetails.module.css";
import MovieList from "../../components/movie/MovieList";

export default function PersonDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [person, setPerson] = useState(location.state?.person || null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(!person);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); //to open extra info about biography

  useEffect(() => {
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

  useEffect(() => {
    (async () => {
      try {
        const c = await getPersonMovieCredits(id);
        setCredits(c);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!person) return <div>Person not found</div>;

  const knownFor =
    credits?.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 20) ??
    [];  //sort by popularity (descendent)

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <img
          src={profileUrl(person.profile_path, "w185")}
          srcSet={`
    ${profileUrl(person.profile_path, "w92")} 92w,
    ${profileUrl(person.profile_path, "w185")} 185w,
    ${profileUrl(person.profile_path, "w342")} 342w,
    ${profileUrl(person.profile_path, "original")} 700w
  `}
          sizes="
    (max-width: 480px) 120px,
    (max-width: 768px) 160px,
    200px
  "
          alt={person.name}
          className={styles.avatar}
          loading="eager"
          decoding="async"
        />
        <div>
          <h2 className={styles.name}>{person.name}</h2>
          {person.birthday && (
            <p className={styles.birthday}>{person.birthday}</p>
          )}
          {person.place_of_birth && (
            <p className={styles.placeOfBirth}>{person.place_of_birth}</p>
          )}
        </div>
      </div>

      <div className={styles.bioContainer}>
        {person.biography && (
          <>
            <p className={`${styles.bio} ${!isOpen ? styles.clamped : ""}`}>
              {person.biography}
            </p>

            {person.biography.length > 300 && (
              <button
                className={styles.toggleBio}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}
      </div>

      {knownFor.length > 0 && (
        <>
          <MovieList title="Known for" movies={knownFor} layout="row" onMovieClick={(movie) => navigate(`/movie/${movie.id}`)} />
        </>
      )}
    </section>
  );
}
