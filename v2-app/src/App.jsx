import "./App.css";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Navbar
          setSearchedMovies={setSearchedMovies}
          setLoading={setLoading}
          setError={setError}
        />
        <AppRoutes
          searchedMovies={searchedMovies}
          setSearchedMovies={setSearchedMovies}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
        {/* <Footer /> */}
      </FavoritesProvider>
    </BrowserRouter>
  );
}
