import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Home, ClipboardList, Zap, Calendar, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Task", icon: ClipboardList, path: "/task" },
    { name: "Scheduler", icon: Zap, path: "/scheduler" },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div style={styles.navContainer}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.navbar}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                color: isActive ? "#7b4dff" : "rgba(255,255,255,0.5)",
              }}
            >
              <item.icon size={24} />
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  style={styles.indicator} 
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

const styles = {
  navContainer: {
    position: "fixed",
    bottom: "20px",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 1000,
    padding: "0 20px"
  },
  navbar: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 25px",
    borderRadius: "32px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.15)"
  },
  navItem: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "8px",
    transition: "color 0.3s ease"
  },
  indicator: {
    position: "absolute",
    bottom: "-4px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#7b4dff",
    boxShadow: "0 0 10px #7b4dff"
  }
};

export default Navbar;
