const IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * Poster images (movie cards, grids)
 * aspect ratio ~2:3
 */
export function posterUrl(path, size = "w342") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

/**
 * Backdrop images (hero banners, page headers)
 * aspect ratio ~16:9
 */
export function backdropUrl(path, size = "w1280") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

/**
 * Screenshots / still frames
 * from /movie/{id}/images -> backdrops[] or stills
 * (TMDb uses backdrops for movie stills)
 */
export function screenshotUrl(path, size = "w780") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

/**
 * Logos (transparent PNGs)
 * from /movie/{id}/images -> logos[]
 */
export function logoUrl(path, size = "w300") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

/**
 * Profile persons photos 
 * from /person/{id}/images -> profile[]
 */
export function profileUrl(path, size = "w185") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}