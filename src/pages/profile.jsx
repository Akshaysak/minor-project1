import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogOut, Save, User, Clock, Bell, Shield, HelpCircle, ChevronRight, Mail } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const prefs = JSON.parse(localStorage.getItem("prefs")) || {};
    setName(user.name || "Lazy Archer");
    setEmail(user.email || "sloth@planner.com");
    setWakeTime(prefs.wakeTime || "08:00");
    setSleepTime(prefs.sleepTime || "23:00");
  }, []);

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify({ name, email }));
    localStorage.setItem("prefs", JSON.stringify({ wakeTime, sleepTime }));
    alert("Preferences saved! Your sloths are happy 🦥");
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out? Your local sloth data will be cleared.")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div style={styles.container}>
      <TopBar title="Sloth Profile" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.header}
      >
        <div style={styles.avatar}>
          <User size={40} color="#5b2cff" />
        </div>
        <h2 style={styles.name}>{name}</h2>
        <p style={styles.email}>{email}</p>
      </motion.div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Identity</h3>
          <div style={styles.card}>
            <div style={styles.row}>
              <div style={styles.rowLead}>
                <User size={18} color="#5b2cff" />
                <span>Full Name</span>
              </div>
              <input 
                type="text" 
                style={styles.textInput} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Name"
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rowLead}>
                <Mail size={18} color="#5b2cff" />
                <span>Email Address</span>
              </div>
              <input 
                type="email" 
                style={styles.textInput} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Daily Routine</h3>
          <div style={styles.card}>
            <div style={styles.row}>
              <div style={styles.rowLead}>
                <Clock size={18} color="#5b2cff" />
                <span>Wake Up Time</span>
              </div>
              <input type="time" style={styles.timeInput} value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
            </div>
            <div style={styles.row}>
              <div style={styles.rowLead}>
                <Clock size={18} color="#5b2cff" />
                <span>Sleep Time</span>
              </div>
              <input type="time" style={styles.timeInput} value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
            </div>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              style={styles.button} 
              onClick={handleSave}
            >
              <Save size={18} />
              Save Routine
            </motion.button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Preferences</h3>
          <div style={styles.card}>
            <div style={styles.rowLink}>
              <div style={styles.rowLead}>
                <Bell size={18} color="rgba(255,255,255,0.4)" />
                <span>Notifications</span>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
            </div>
            <div style={styles.rowLink}>
              <div style={styles.rowLead}>
                <Shield size={18} color="rgba(255,255,255,0.4)" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
            </div>
            <div style={{ ...styles.rowLink, borderBottom: 'none' }}>
              <div style={styles.rowLead}>
                <HelpCircle size={18} color="rgba(255,255,255,0.4)" />
                <span>Help & Support</span>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
            </div>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          style={styles.logout} 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sign Out of Colony
        </motion.button>
        
        <p style={styles.version}>Laziness Planner v2.4.0</p>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    backgroundColor: "transparent", 
    minHeight: "100vh" 
  },
  header: { 
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    color: "#fff", 
    padding: "60px 20px 40px 20px", 
    textAlign: "center", 
    borderBottomLeftRadius: "40px", 
    borderBottomRightRadius: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  },
  avatar: { 
    width: "100px", 
    height: "100px", 
    borderRadius: "32px", 
    backgroundColor: "rgba(123, 77, 255, 0.2)", 
    margin: "0 auto 20px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(-5deg)",
    boxShadow: "0 10px 30px rgba(123,77,255,0.2)",
    border: "2px solid rgba(123, 77, 255, 0.3)"
  },
  name: { 
    fontSize: "26px", 
    fontWeight: "800", 
    marginBottom: "6px",
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.5px"
  },
  email: { 
    fontSize: "14px", 
    opacity: 0.6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  content: { 
    padding: "20px", 
    paddingBottom: "120px" 
  },
  section: {
    marginBottom: "35px"
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#7b4dff",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "15px",
    paddingLeft: "10px"
  },
  card: { 
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(16px)",
    padding: "10px 24px", 
    borderRadius: "28px", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  row: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "20px 0", 
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)" 
  },
  rowLink: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "20px 0", 
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    cursor: "pointer"
  },
  rowLead: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "15px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)"
  },
  textInput: {
    padding: "8px 0",
    border: "none",
    fontSize: "15px",
    outline: "none",
    color: "#fff",
    fontWeight: "600",
    textAlign: "right",
    width: "180px",
    backgroundColor: "transparent"
  },
  timeInput: {
    padding: "8px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    outline: "none",
    color: "#7b4dff",
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  button: { 
    width: "100%", 
    padding: "16px", 
    background: "#7b4dff", 
    color: "#fff", 
    border: "none", 
    borderRadius: "20px", 
    marginTop: "20px", 
    marginBottom: "10px",
    cursor: "pointer", 
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(123,77,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  logout: { 
    width: "100%", 
    padding: "18px", 
    backgroundColor: "rgba(255, 77, 77, 0.1)", 
    color: "#ff4d4d", 
    border: "1px solid rgba(255, 77, 77, 0.2)", 
    borderRadius: "24px", 
    marginTop: "10px", 
    cursor: "pointer",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  version: {
    textAlign: "center",
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
    marginTop: "40px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px"
  }
};

export default Profile;
