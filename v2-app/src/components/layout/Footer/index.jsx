import styles from "./Footer.module.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { useLocation } from "react-router-dom";

export default function Footer() {

  const location = useLocation();
  const isInDiscover = location.pathname === "/discover";

  if(isInDiscover) return null;

  return (
    <footer style={{ marginTop: "7vh" }}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerLeft}>
          <span>Powered by </span>
          <a
            href="https://developer.themoviedb.org/docs/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit The Movie Database API documentation"
            id="navLinks"
          >
            TMDB API
          </a>
        </div>

        <div className={styles.footerRight}>
          <a
            href="https://pedromagalhaes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Pedro Magalhães portfolio website"
            id="navLinks"
          >
            <ContactPhoneIcon aria-hidden="true" focusable="false" />
          </a>
          <a
            href="https://www.linkedin.com/in/pedro-magalhães-1a3651334/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedro Magalhães on LinkedIn"
            id="navLinks"
          >
            <LinkedInIcon aria-hidden="true" focusable="false" />
          </a>
          <a
            href="https://github.com/Pedrocas74"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedro Magalhães on GitHub"
            id="navLinks"
          >
            <GitHubIcon aria-hidden="true" focusable="false" />
          </a>
        </div>
      </div>
    </footer>
  );
}
