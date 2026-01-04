import styles from "./MovieCard.module.css";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SeeMoreCard({ label, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.movieCard} ${styles.seeMore}`}
      onClick={onClick}
    >
      <div className={styles.seeMoreContent}>
        <ArrowRight size={28} />
        <p>{label}</p>
      </div>
    </motion.div>
  );
}
