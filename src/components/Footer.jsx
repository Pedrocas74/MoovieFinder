import styles from "../styles/Footer.module.css";
import gitHubIcon from "/icons/github-mark-white.png";
import linkedinIcon from "/icons/InBug-White.png";

export default function Footer({ darkMode }) {
  return (
    <footer
      style={{
        background: darkMode ? "#b032eb " : "#8f1919",
      }}
    >
      <span>
        Powered by{" "}
        <a
          href="https://developer.themoviedb.org/docs/getting-started"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit The Movie Database API documentation"
        >
          TMDB API
        </a>
      </span>
      <div className={styles.socials}>
        <span className={styles.pedro}>
          <a
            href="https://pedromagalhaes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Pedro Magalhães portfolio website"
          >
            made by Pedro
          </a>{" "}
          |
        </span>
        <a
          href="https://github.com/Pedrocas74"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedro Magalhães on GitHub"
        >
          <img src={gitHubIcon} alt="GitHub Icon" width={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/pedro-magalhães-1a3651334/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedro Magalhães on LinkedIn"
        >
          <img
            src={linkedinIcon}
            alt="Linkedin Icon"
            width={20}
            style={{ marginLeft: 10 }}
          />
        </a>
      </div>
    </footer>
  );
}
