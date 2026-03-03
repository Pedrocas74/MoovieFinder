export function sortMovies(movies, sort) { //handles sort logic for sortSelect component
  const list = [...movies];

  switch (sort) {
    case "most_rated":
      return list.sort(
        (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)
      );

    case "lowest_rated":
      return list.sort(
        (a, b) => (a.vote_average ?? 0) - (b.vote_average ?? 0)
      );
      //localeCompare() compares two strings alphabetically
      //-1 → if the first string comes before the second
      //1 → if it comes after
      //0 → if they’re equal
    case "recent":
      return list.sort((a, b) =>
        (b.release_date ?? "").localeCompare(a.release_date ?? "")
      );

    case "oldest":
      return list.sort((a, b) =>
        (a.release_date ?? "").localeCompare(b.release_date ?? "")
      );

    case "crescent":
      return list.sort((a, b) =>
        (a.title ?? a.name ?? "").localeCompare(
          b.title ?? b.name ?? ""
        )
      );

    case "decrescent":
      return list.sort((a, b) =>
        (b.title ?? b.name ?? "").localeCompare(
          a.title ?? a.name ?? ""
        )
      );

    default:
      return list;
  }
}