import MovieCard from "../MovieCard";
import styles from "./MovieList.module.css";
import { useState, useRef, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MovieList({
  title,
  movies,
  layout,
  onMovieClick,
  tailCard,
  emptyMessage = "No movies to show.",
}) {
  const [openMenuMovieId, setOpenMenuMovieId] = useState(null); //to only allow one radial menu open at once
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -650, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 650, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && layout === "row") {
      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [layout, movies]);

  if (!movies || movies.length === 0) {
    return (
      <section className={styles.emptyList}>
        {title && <h2>{title}</h2>}
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.movieList}>
      {title && <h2>{title}</h2>}
      {layout === "row" && (
        <div className={styles.scrollContainer}>
          {canScrollLeft && (
            <button
              className={`${styles.scrollButton} actionButton ${
                !canScrollRight ? styles.leftAtEnd : ""
              }`}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={100} color="var(--clr-text)" />
            </button>
          )}
          <div className={styles[layout]} ref={scrollContainerRef}>
            {movies.map((movie, index) => {
              const key = `movielist-${title || "untitled"}-${movie.id}`;

              //check for duplicate keys within this list
              const duplicateInList =
                movies.findIndex(
                  (m, i) =>
                    i !== index &&
                    `movielist-${title || "untitled"}-${m.id}` === key
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
          {canScrollRight && (
            <button
              className={`${styles.scrollButton} actionButton`}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={100} color="var(--clr-text)" />
            </button>
          )}
        </div>
      )}
      {layout !== "row" && (
        <div className={styles[layout]}>
          {movies.map((movie, index) => {
            const key = `movielist-${title || "untitled"}-${movie.id}`;

            //check for duplicate keys within this list
            const duplicateInList =
              movies.findIndex(
                (m, i) =>
                  i !== index &&
                  `movielist-${title || "untitled"}-${m.id}` === key
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
