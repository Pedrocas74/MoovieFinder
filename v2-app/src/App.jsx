
import "./App.css";

import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Navbar />
        <AppRoutes />
        <Footer />
      </FavoritesProvider>
    </BrowserRouter>
  );
}