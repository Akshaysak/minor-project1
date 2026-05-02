import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import Background from "../components/Background";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    localStorage.setItem("user", JSON.stringify({ name: email.split("@")[0], email }));
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <Background />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.card}
      >
        <h2 style={styles.heading}>Start Small</h2>
        <p style={styles.subtext}>
          Join thousands of smart sloths planning better.
        </p>

        <div style={styles.inputWrapper}>
          <Mail size={18} color="rgba(255,255,255,0.4)" />
          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <Lock size={18} color="rgba(255,255,255,0.4)" />
          <input
            style={styles.input}
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <UserPlus size={18} color="rgba(255,255,255,0.4)" />
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={styles.button} 
          onClick={handleSignup}
        >
          Create Account
          <ArrowRight size={20} style={{ marginLeft: 10 }} />
        </motion.button>

        <p style={styles.footer}>
          Already a pro sloth?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Sign In here
          </span>
        </p>
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
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    padding: "40px 30px",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
  },
  logo: {
    width: "130px",
    height: "130px",
    objectFit: "contain",
    marginBottom: "20px",
    filter: "drop-shadow(0px 10px 20px rgba(91,44,255,0.3))"
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  subtext: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "30px",
    fontWeight: "500"
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "0 20px",
    borderRadius: "18px",
    margin: "8px 0",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s"
  },
  input: {
    flex: 1,
    padding: "16px 12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "transparent",
    color: "#fff"
  },
  button: {
    width: "100%",
    padding: "18px",
    marginTop: "20px",
    backgroundColor: "#7b4dff",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 20px rgba(123,77,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  footer: {
    marginTop: "25px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.5)"
  },
  link: {
    color: "#7b4dff",
    cursor: "pointer",
    fontWeight: "800"
  }
};

export default Signup;
