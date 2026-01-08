import { motion } from "framer-motion";

export default function LoadingSVG() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    height: "40px",
  };

  const dotStyle = {
    width: "12px",
    height: "12px",
    backgroundColor: "var(--clr-primary)",
    borderRadius: "50%",
    display: "block"
  };

  return (
    <div style={containerStyle}>
      <motion.span
        style={dotStyle}
        animate={{ opacity: [1, 0.4, 1], y: [0, -12, 0] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.span
        style={dotStyle}
        animate={{ opacity: [1, 0.4, 1], y: [0, -12, 0] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <motion.span
        style={dotStyle}
        animate={{ opacity: [1, 0.4, 1], y: [0, -12, 0] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </div>
  );
}
