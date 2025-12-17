
import styles from './Library.module.css';
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../../components/movie/MovieList";
import { useLibrary } from "../../context/LibraryContext";

export default function Library() {
  const navigate = useNavigate();
  const { watched, watchlist, favorites } = useLibrary();

  const [tab, setTab] = useState("watchlist"); // "watchlist" | "watched" | "favorites"

  const movies = useMemo(() => {
    if (tab === "watched") return watched;
    if (tab === "favorites") return favorites;
    return watchlist;
  }, [tab, watched, favorites, watchlist]);

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  let tabTitle = tab.charAt(0).toUpperCase() + tab.slice(1);

  return (
    <section className={styles.librarySection}>
      <h2>My Library</h2>

      <div className={styles.tabsContainer}>
        <button onClick={() => setTab("watchlist")}>
          Watchlist ({watchlist.length})
        </button>
        <button onClick={() => setTab("watched")}>
          Watched ({watched.length})
        </button>
        <button onClick={() => setTab("favorites")}>
          Favorites ({favorites.length})
        </button>
      </div>

        <h3>{tabTitle}</h3>

      {movies.length === 0 ? (
        <p>No movies here yet.</p>
      ) : (
        <MovieList
          movies={movies}
          layout="grid"
          onMovieClick={handleOpenDetails}
        />
      )}
    </section>
  );
}
