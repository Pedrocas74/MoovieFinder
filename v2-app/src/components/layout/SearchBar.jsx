import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import styles from "./SearchBar.module.css";
import { useEffect, useState, useRef } from "react";
import { searchMovies } from "../../services/tmdb";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ autoFocus = false, onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [autoFocus]);

  //debounced suggestions
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const results = await searchMovies(q);

        const seen = new Set();
        const unique = results.filter((movie) => {
          if (!movie.id || seen.has(movie.id)) {
            return false;
          }
          seen.add(movie.id);
          return true;
        });

        setSuggestions(unique.slice(0, 6));

        // Debug: Check for duplicates
        const ids = unique.map((m) => m.id);
        const duplicateIds = ids.filter(
          (id, index) => ids.indexOf(id) !== index
        );
        if (duplicateIds.length > 0) {
          console.warn("Duplicate movie IDs found:", duplicateIds);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <Combobox
      value={selected}
      by="id"
      autoComplete="off" //disable input history - Chrome might ignore it
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      name="movie-search"
      onChange={(movie) => {
        if (!movie || !movie.id) {
          // console.warn("Invalid movie selected:", movie);
          return;
        }
        // console.log("Navigating to movie:", movie.id, movie.title);
        navigate(`/movie/${movie.id}`, { state: { movie } });

        setQuery("");
        setSuggestions([]);
        setSelected(null);

        onClose?.();
      }}
    >
      <div className={styles.searchContainer}>
        <ComboboxInput
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          name="movie-search"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              setSuggestions([]);
              setSelected(null);
              onClose?.(); // ✅ close overlay on Esc
            }
          }}
          onBlur={() => {
            // optional UX: close when leaving the field
            // (if you don't want this behavior, remove this block)
            onClose?.();
          }}
        />

        {suggestions.length > 0 && (
          <ComboboxOptions className={styles.dropdown}>
            {suggestions
              .map((movie, index) => {
                const isDuplicate =
                  suggestions.findIndex((m) => m.id === movie.id) !== index;
                if (isDuplicate) {
                  console.warn(
                    "Rendering duplicate movie:",
                    movie.id,
                    movie.title
                  );
                  return null;
                }

                return (
                  <ComboboxOption
                    key={`searchbar-${movie.id}-${movie.title}-${index}`}
                    value={movie}
                    className={styles.item}
                  >
                    <div className={styles.title}>{movie.title}</div>
                    {movie.release_date && (
                      <div className={styles.year}>
                        {movie.release_date.slice(0, 4)}
                      </div>
                    )}
                  </ComboboxOption>
                );
              })
              .filter(Boolean)}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
