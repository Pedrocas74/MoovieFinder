export function selectBestTrailer(videos) {
//if a youtube video whose type is exactly "Trailer" doesn't exist -> any Youtube video (teaser/clip)
  return (
    videos?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ||
    videos?.find((v) => v.site === "YouTube") ||
    null
  );
}