import { useState } from "react";

export default function SearchBar({ setMovies, setLoading, setError }) {
  const [query, setQuery] = useState("");

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${query}`
      );
      const data = await res.json();
      if (data.results.length > 0) setMovies(data.results);
      else setError("No movies found!");
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div>
      <label htmlFor="title">
        <input type="text" onSubmit={searchMovies} required />
      </label>
      <button type="submit">Search</button>
    </div>
  );
}
