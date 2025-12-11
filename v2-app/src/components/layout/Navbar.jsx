import styles from "./Navbar.module.css";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <header>
      <nav>
        <h1>Moo</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
