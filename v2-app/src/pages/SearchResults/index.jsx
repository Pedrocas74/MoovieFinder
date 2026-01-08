import styles from "./SearchResults.module.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/tmdb";
import MovieList from "../../components/movie/MovieList";
import LoadingSVG from "../../components/ui/LoadingSVG";
import ErrorPlaceholder from "../../components/feedback/ErrorPlaceholder";

import SortSelect from "../../components/filters/sortSelect";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("");
  const [effectiveQuery, setEffectiveQuery] = useState("");

  const q = (params.get("q") || "").trim();

  useEffect(() => {
    if (!q) {
      setMovies([]);
      setError(null);
      setEffectiveQuery("");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setEffectiveQuery("");

        //try full query, then remove last letter until results found
        let currentQuery = q;
        let results = [];

        while (currentQuery.length > 0) {
          results = await searchMovies(currentQuery, [], 3);
          if (results?.length > 0) {
            setEffectiveQuery(currentQuery);
            break;
          }
          //remove last character
          currentQuery = currentQuery.slice(0, -1);
        }

        setMovies(results);
        if (!results?.length) {
          setError("No movies found!");
          setEffectiveQuery("");
        }
      } catch {
        setError("Unable to fetch.");
        setMovies([]);
        setEffectiveQuery("");
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const sortedMovies = useMemo(() => {
    const list = [...movies];

    if (sort === "most_rated")
      return list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));

    if (sort === "lowest_rated")
      return list.sort((a, b) => (a.vote_average ?? 0) - (b.vote_average ?? 0));

    if (sort === "recent")
      return list.sort((a, b) =>
        (b.release_date ?? "").localeCompare(a.release_date ?? "")
      );

    if (sort === "oldest")
      return list.sort((a, b) =>
        (a.release_date ?? "").localeCompare(b.release_date ?? "")
      );

    if (sort === "crescent")
      return list.sort((a, b) =>
        (a.title ?? a.name ?? "").localeCompare(b.title ?? b.name ?? "")
      );

    if (sort === "decrescent")
      return list.sort((a, b) =>
        (b.title ?? b.name ?? "").localeCompare(a.title ?? a.name ?? "")
      );

    return list;
  }, [movies, sort]);

  // const runSearch = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const results = await searchMovies(query);
  //     setMovies(results);
  //   } catch (e) {
  //     setError("We couldn’t fetch search results.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [query]);

  const openMovie = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>
        {q
          ? effectiveQuery && effectiveQuery !== q
            ? `Results for "${effectiveQuery}" (searched for "${q}")`
            : `Results for "${q}"`
          : "Search"}
      </h2>

      <div className={styles.selectContainer}>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading && <LoadingSVG />}
      {!loading && error && (
        <ErrorPlaceholder
          type="network"
          title="Search failed"
          message={error || "We couldn’t fetch results. Please try again."}
          compact
        />
      )}

      {!loading && !error && (
        <MovieList
          movies={sortedMovies}
          layout="grid"
          onMovieClick={openMovie}
          emptyMessage="Type something to search or select genres."
        />
      )}
    </section>
  );
}
