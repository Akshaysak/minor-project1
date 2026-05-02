import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Background from "../components/Background";

function Splash() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <Background />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={styles.content}
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={styles.title}
        >
          Laziness <span style={styles.titleAccent}>Planner</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={styles.subtitle}
        >
          Productivity without the stress. Plan your day with guilt-free breaks and sloth-like pacing.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={styles.buttonGroup}
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.signupBtn} 
            onClick={() => navigate("/signup")}
          >
            Join the Sloths
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.loginBtn} 
            onClick={() => navigate("/login")}
          >
            Welcome Back
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
    overflow: "hidden",
    position: "relative"
  },
  content: {
    zIndex: 10,
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  logo: {
    width: "180px",
    height: "auto",
    marginBottom: "30px",
    filter: "drop-shadow(0 20px 40px rgba(91,44,255,0.4))"
  },
  title: {
    fontSize: "42px",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "-1.5px",
    marginBottom: "15px",
    fontFamily: "var(--font-display)"
  },
  titleAccent: {
    color: "rgba(255,255,255,0.4)",
    fontWeight: "300",
    fontStyle: "italic"
  },
  subtitle: {
    margin: "0 0 45px 0",
    fontSize: "16px",
    color: "rgba(255,255,255,0.6)",
    lineHeight: "1.6",
    fontWeight: "500"
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "320px"
  },
  signupBtn: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#7b4dff",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(123,77,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  loginBtn: {
    width: "100%",
    padding: "18px",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  }
};

export default Splash;
