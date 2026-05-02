import React from "react";
import { motion } from "motion/react";

function TopBar({ title }) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={styles.topbar}
    >
      <h2 style={styles.title}>{title}</h2>
    </motion.div>
  );
}

const styles = {
  topbar: {
    backgroundColor: "rgba(11, 14, 20, 0.4)",
    backdropFilter: "blur(20px)",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center"
  },
  title: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "var(--font-display)"
  }
};

export default TopBar;
