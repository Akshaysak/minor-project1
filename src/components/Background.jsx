import React from "react";

const Background = () => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.glow, backgroundColor: "#5b2cff", top: "-10%", left: "-10%" }}></div>
      <div style={{ ...styles.glow, backgroundColor: "#fffd82", bottom: "-10%", right: "-10%", animationDelay: "-5s" }}></div>
      <div style={{ ...styles.glow, backgroundColor: "#7b4dff", top: "40%", left: "50%", animationDuration: "15s" }}></div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundColor: "#0b0e14",
    overflow: "hidden"
  },
  glow: {
    position: "absolute",
    width: "60vw",
    height: "60vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    opacity: 0.15,
    animation: "float 25s infinite alternate ease-in-out"
  }
};

export default Background;
