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
import placeholder_cover from "/images/placeholder_movie.webp";
import { TextSearch } from "lucide-react";

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

        //check for duplicates
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

  const handleFullSearch = () => {
    const q = query.trim();
    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
    setSuggestions([]);
    setSelected(null);
    onClose?.();
  };

  return (
    <Combobox
      value={selected}
      by="id"
      autoComplete="off" //disable input history - Chrome might ignore it
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      name="movie-search"
      onChange={(value) => {
        if (!value || value.__type === "search") return;

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
              onClose?.(); //close overlay on Esc
            } else if (e.key === "Enter" && query.trim() && !selected) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              setQuery("");
              setSuggestions([]);
              setSelected(null);
              onClose?.();
            }
          }}
          onBlur={() => {
            //close when leaving the field
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
                    <div style={{ flex: 2, maxWidth: "85%" }}>
                      <div className={styles.title}>{movie.title}</div>
                      {movie.release_date && (
                        <div className={styles.year}>
                          {movie.release_date.slice(0, 4)}
                        </div>
                      )}
                    </div>
                    <div className={styles.coverContainer}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                            : placeholder_cover
                        }
                        alt={movie.title}
                        onError={(e) => {
                          e.target.onerror = null; //prevent infinite loop
                          e.target.src = placeholder_cover;
                        }}
                      />
                    </div>
                  </ComboboxOption>
                );
              })
              .filter(Boolean)}

            <div className={styles.separator} />

            <ComboboxOption
              value={{ __type: "search" }}
              className={`${styles.item} ${styles.searchAll}`}
              onMouseDown={(e) => {
                e.preventDefault(); //prevent Combobox selection
                handleFullSearch();
              }}
            >
              <TextSearch size={20} style={{marginRight: 5}} /> Search for “{query}”
            </ComboboxOption>
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
