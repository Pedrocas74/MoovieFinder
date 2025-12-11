import styles from "./Footer.module.css";


export default function Footer({ darkMode }) {
  return (
    <footer
    >
      <div className={styles.footerWrapper}>
        <div className={styles.footerLeft}>
      <span>
        Powered by{" "}
        <a
          href="https://developer.themoviedb.org/docs/getting-started"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit The Movie Database API documentation"
          id="navLinks"
        >
          TMDB API
        </a>
      </span>
      <span className={styles.pedro}>
          <a
            href="https://pedromagalhaes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Pedro Magalhães portfolio website"
            id="navLinks"
          >
            made by Pedro
          </a>{" "}
        </span>
        </div>
      <div className={styles.footerRight}>
        <a
          href="https://github.com/Pedrocas74"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedro Magalhães on GitHub"
          id="navLinks"
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/pedro-magalhães-1a3651334/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedro Magalhães on LinkedIn"
          id="navLinks"
        >
          linkedin
        </a>
      </div>
      </div>
    </footer>
  );
}
