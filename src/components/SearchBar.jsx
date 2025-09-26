import styles from '../styles/SearchBar.module.css';
import { useState } from "react";

export default function SearchBar({ setMovies, setLoading, setError }) {
  const [query, setQuery] = useState("");

  const searchMovies = async (e) => {
    e.preventDefault();
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
      else setError("No movies found!");
    } catch {
      setError("Unable to fetch.");
    } finally {
      setLoading(false);
    }
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
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
