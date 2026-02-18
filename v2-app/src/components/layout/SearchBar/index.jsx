import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import styles from "./SearchBar.module.css";
import { useEffect, useState, useRef } from "react";
import { searchMovies } from "../../../services/tmdb";
import { useNavigate } from "react-router-dom";
import placeholder_cover from "/images/placeholder_movie.webp";
import { TextSearch } from "lucide-react";

export default function SearchBar({ autoFocus = false, onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const inputRef = useRef(null);

  useEffect(() => {   //autofocus on input field when searchIsOpen
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [autoFocus]);

  //debounced SEARCH SUGGESTIONS
  useEffect(() => {
    const q = query.trim(); //trims the query and bails early if it’s empty
    if (!q) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => { //this prevents calling searchMovies on every keystroke instantly
      try { //fetches results
        const results = await searchMovies(q);

        const seen = new Set();
        const unique = results.filter((movie) => {  //removes duplicates by movie.id
          if (!movie.id || seen.has(movie.id)) {
            return false;
          }
          seen.add(movie.id); 
          return true;
        });

        setSuggestions(unique.slice(0, 6)); //limits suggestions to 6 items

      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  //last option from search suggestions -> navigate to SEARCH RESULTS page using a specific untoutched query
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
      onChange={(value) => { //when a suggestion is chosen, navigate to its moviedetails page 
        if (!value || value.__type === "search") return;

        navigate(`/movie/${value.id}`, { state: { movie: value } });

        setQuery("");
        setSuggestions([]);
        setSelected(null);
      }}
    >
      <div className={styles.searchContainer}>
        <div className={styles.inputFrame}>
          <ComboboxInput
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
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
                navigate(`/search?q=${encodeURIComponent(query.trim())}`); //navigate to SEARCH RESULTS page on ENTER press
                setQuery("");
                setSuggestions([]);
                setSelected(null);
                onClose?.();
              }
            }}
          />
        </div>
        <Transition  //smooth entrance/exit transition of the dropdown menu (search suggestions)
          as={Fragment}
          show={suggestions.length > 0}
          enter={styles.enter}
          enterFrom={styles.enterFrom}
          enterTo={styles.enterTo}
          leave={styles.leave}
          leaveFrom={styles.leaveFrom}
          leaveTo={styles.leaveTo}
        >
          <ComboboxOptions className={styles.dropdown}>
            {/* render the search suggestions from the suggestions array  */}
            {suggestions
              .map((movie, index) => {
                const isDuplicate =
                  suggestions.findIndex((m) => m.id === movie.id) !== index; //returns the index of the first movie in the array with that id 
                if (isDuplicate) {                   //if that first index is not the current index, then this item is a duplicate 
                  console.warn(
                    "Rendering duplicate movie:",
                    movie.id,
                    movie.title
                  );
                  return null; //render nothing in case its a duplicate
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
                          e.target.onerror = null; //prevent infinite loop if the placeholder image also fails
                          e.target.src = placeholder_cover;
                        }}
                      />
                    </div>
                  </ComboboxOption>
                );
              })
              .filter(Boolean) //remove the NULLs returned for duplicates
              }

            <div className={styles.separator} />

            <ComboboxOption //last option from dropdown menu 
              value={{ __type: "search" }}
              className={`${styles.item} ${styles.searchAll}`}
              onMouseDown={(e) => {
                e.preventDefault(); //prevent Combobox selection
                handleFullSearch();
              }}
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              <TextSearch size={20} style={{ marginRight: 5 }} /> Search for “
              {query}”
            </ComboboxOption>
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
}
