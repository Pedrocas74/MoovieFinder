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
        >
          TMBd API
        </a>
      </span>
      <span>
        <a
          href="https://pedromagalhaes.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >made by Pedro</a>
      </span>
      <div className={styles.socials}>
        <a
          href="https://github.com/Pedrocas74"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={gitHubIcon} alt="GitHub Link" width={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/pedro-magalh%C3%A3es-1a3651334/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={linkedinIcon}
            alt="Linkedin Link"
            width={20}
            style={{ marginLeft: 10 }}
          />
        </a>
      </div>
    </footer>
  );
}
