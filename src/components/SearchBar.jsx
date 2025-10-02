import styles from "../styles/SearchBar.module.css";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  setMovies,
  setLoading,
  setError,
  darkMode,
}) {
  const [query, setQuery] = useState("");

  const searchMoviesByQuery = async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWVmMzhmYWQ2OTlmNGFkOWEyOWZlNjkzNTAyMWRiYyIsIm5iZiI6MTc1MTI3NzM0OC42MTIsInN1YiI6IjY4NjI1ZjI0YWNiZTZjZDNjYzRkMjJjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PYTZP-1wMl_JBxhzK7uZ5_BN5hLEOYZRqs9Jy4ipLxY",
      },
    };

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${query}`,
        options
      );
      const data = await res.json();

      if (data.results.length > 0) setMovies(data.results);
      else if (query.length > 1)
        searchMoviesByQuery(query.slice(0, -1)); //retry with last char removed
      else setError("No movies found!");
    } catch {
      setError("Unable to fetch.");
      setMovies([]);
    } finally {
      setQuery("");
    }
  };

  // Form submit handler
  const searchMovies = (e) => {
    e.preventDefault();
    searchMoviesByQuery(query);
  };

  return (
    <form className={styles.searchForm} onSubmit={searchMovies}>
      <label htmlFor="search">
        <input
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies"
          required
          style={{
            border: darkMode ? "2.5px solid #b032eb" : "2.5px solid #8f1919",
            background: darkMode ? "#1d1814" : "#f5f5e9",
            color: darkMode ? "#f5f5e9" : " #1d1814",
          }}
        />
        <button type="submit">
          <Search className={styles.searchIcon} />
        </button>
      </label>
    </form>
  );
}
