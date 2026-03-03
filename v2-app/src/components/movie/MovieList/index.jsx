import MovieCard from "../MovieCard";
import styles from "./MovieList.module.css";
import { useState, useRef, useEffect, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import SortSelect from "../../filters/sortSelect";
//utils
import { sortMovies } from "../../../utils/sortMovies";

export default function MovieList({
  title,
  movies,
  layout,
  onMovieClick,
  tailCard,
  emptyMessage = "No movies to show.",
  sort = "",
  onSortChange,
}) {
  const [openMenuMovieId, setOpenMenuMovieId] = useState(null); //to only allow one radial menu open at once
  const [canScrollLeft, setCanScrollLeft] = useState(false); //state to when the user already scrolled to the right of the list
  const [canScrollRight, setCanScrollRight] = useState(true); //similar to top comment, but to the left
  const scrollContainerRef = useRef(null); //reference of the entire movielist scrollable container

  const isTouchDevice = window.matchMedia(
    //check if user is using a touch device
    "(hover: none) and (pointer: coarse)",
  ).matches;

  //activates after change on sortSelect component
  const sortedMovies = useMemo(() => {
  return sortMovies(movies, sort);
}, [movies, sort]);

  //reads the scroll position from the container and updates the horizontal scrolling allowance states below
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0); //show left arrow when already scrolled to right
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); //inverse
    }
  };

  //wires up event listeners so the arrow logic stays correct as things change
  useEffect(() => {
    const container = scrollContainerRef.current;
    //only runs when the container exists and it's a row
    if (container && layout === "row") {
      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [layout, sortedMovies]);

  //when the sort changes, reset horizontal scroll to the start
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && layout === "row") {
      //jump or smooth scroll to the left entirely
      try {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } catch {
        container.scrollLeft = 0;
      }
    }
  }, [sort, layout]);

  const scrollLeft = () => {
    //scroll handler for left arrow button
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    //scroll handler for right arrow button
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  //fallback
  if (!sortedMovies || sortedMovies.length === 0) {
    return (
      <section className={styles.emptyList}>
        {title && <h2>{title}</h2>}
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.movieList}>
      {/* add a sort filter select in case it's a row of movies  */}
      {title && layout === "row" && (
        <div className={styles.header}>
          <h2>{title}</h2>
          {onSortChange && <SortSelect value={sort} onChange={onSortChange} />}
        </div>
      )}
      {title && layout !== "row" && <h2>{title}</h2>}
      {layout === "row" && (
        <div className={styles.scrollContainer}>
          {!isTouchDevice && canScrollLeft && (
            <button
              className={`${styles.scrollButton} actionButton ${
                !canScrollRight ? styles.leftAtEnd : ""
              }`}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft
                size={100}
                color="var(--clr-text)"
                aria-hidden="true"
                focusable="false"
              />
            </button>
          )}
          <div className={styles[layout]} ref={scrollContainerRef}>
            {sortedMovies.map((movie, index) => {
              const key = `movielist-${title || "untitled"}-${movie.id}`;

              //check for duplicate keys within this list
              const duplicateInList =
                sortedMovies.findIndex(
                  (m, i) =>
                    i !== index &&
                    `movielist-${title || "untitled"}-${m.id}` === key,
                ) !== -1;

              if (duplicateInList) {
                console.warn(`Duplicate key in ${title}:`, key, movie.title);
              }

              return (
                <MovieCard
                  key={key}
                  movie={movie}
                  onClick={onMovieClick}
                  menuOpen={openMenuMovieId === movie.id}
                  onOpenMenu={() => setOpenMenuMovieId(movie.id)}
                  onCloseMenu={() => setOpenMenuMovieId(null)}
                />
              );
            })}

            {tailCard}
          </div>
          {!isTouchDevice && canScrollRight && (
            <button
              className={`${styles.scrollButton} actionButton`}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight
                size={100}
                color="var(--clr-text)"
                aria-hidden="true"
                focusable="false"
              />
            </button>
          )}
        </div>
      )}
      {layout !== "row" && (
        <div className={styles[layout]}>
          {sortedMovies.map((movie, index) => {
            const key = `movielist-${title || "untitled"}-${movie.id}`;

            //check for duplicate keys within this list
            const duplicateInList =
              sortedMovies.findIndex(
                (m, i) =>
                  i !== index &&
                  `movielist-${title || "untitled"}-${m.id}` === key,
              ) !== -1;

            if (duplicateInList) {
              console.warn(`Duplicate key in ${title}:`, key, movie.title);
            }

            return (
              <MovieCard
                key={key}
                movie={movie}
                onClick={onMovieClick}
                menuOpen={openMenuMovieId === movie.id}
                onOpenMenu={() => setOpenMenuMovieId(movie.id)}
                onCloseMenu={() => setOpenMenuMovieId(null)}
              />
            );
          })}

          {tailCard}
        </div>
      )}
    </section>
  );
}
