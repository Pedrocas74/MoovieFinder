import styles from "./SearchBar.module.css";
import { useState } from "react";
import { Search } from "lucide-react";
import { searchMovies } from "../../services/tmdb.js";

export default function SearchBar({ setSearchedMovies, setLoading, setError }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);

      if (results.length > 0) {
        setSearchedMovies(results);
      } else {
        setError("No movies found!");
        setSearchedMovies([]);
      }
    } catch {
      setError("Unable to fetch.");
      setSearchedMovies([]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch}>
        <input
          name="searchMovies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">
          <Search size={15} />
        </button>
      </form>
    </div>
  );
}
