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
    backgroundColor: "#8f1919",
    borderRadius: "50%",
  };

  return (
    <div style={containerStyle}>
      <motion.span
        style={dotStyle}
        animate={{ y: [0, -12] }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.span
        style={dotStyle}
        animate={{ y: [0, -12] }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.span
        style={dotStyle}
        animate={{ y: [0, -12] }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
