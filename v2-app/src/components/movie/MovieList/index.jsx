import MovieCard from "../MovieCard";
import styles from "./MovieList.module.css";
import { useState, useRef, useEffect, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import SortSelect from "../../filters/sortSelect";

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  const sortedMovies = useMemo(() => {
    let list = [...movies];

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
        (b.title ?? a.name ?? "").localeCompare(a.title ?? a.name ?? "")
      );

    return list;
  }, [movies, sort]);

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
  }, [layout, sortedMovies]);

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
              <ChevronLeft size={100} color="var(--clr-text)" aria-hidden="true" focusable="false"/>
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
          {!isTouchDevice && canScrollRight && (
            <button
              className={`${styles.scrollButton} actionButton`}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={100} color="var(--clr-text)" aria-hidden="true" focusable="false"/>
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
