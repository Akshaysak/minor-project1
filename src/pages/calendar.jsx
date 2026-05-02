import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return offsetDate.toISOString().split("T")[0];
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));
    return days;
  };

  const days = getDaysInMonth();
  const filteredTasks = tasks.filter((task) => task.dueDate === selectedDate);
  const taskDates = tasks.map(t => t.dueDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return (
    <div style={styles.container} className="no-scrollbar">
      <TopBar title="Laziness Log" />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.content}
      >
        <div style={styles.calendarCard}>
          <div style={styles.header}>
            <motion.button whileTap={{ scale: 0.9 }} style={styles.navBtn} onClick={handlePrevMonth}>
              <ChevronLeft size={20} />
            </motion.button>
            <h3 style={styles.monthTitle}>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
            <motion.button whileTap={{ scale: 0.9 }} style={styles.navBtn} onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </motion.button>
          </div>

          <div style={styles.grid}>
            {["S","M","T","W","T","F","S"].map((day, idx) => (
              <div key={`header-${idx}`} style={styles.dayHeaderLabel}>{day}</div>
            ))}
            {days.map((date, index) => {
              const formatted = date ? formatDate(date) : "";
              const isSelected = formatted === selectedDate;
              const hasTask = taskDates.includes(formatted);
              const isToday = formatted === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={index}
                  style={{
                    ...styles.cell,
                    backgroundColor: isSelected ? "#7b4dff" : "transparent",
                    color: isSelected ? "#fff" : date ? "rgba(255,255,255,0.8)" : "transparent",
                    boxShadow: isSelected ? "0 0 15px rgba(123,77,255,0.4)" : "none",
                    border: isSelected ? "1px solid rgba(255,255,255,0.2)" : "none"
                  }}
                  onClick={() => date && setSelectedDate(formatted)}
                >
                  <span style={{ 
                    fontWeight: isToday ? "800" : isSelected ? "700" : "500",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {date ? date.getDate() : ""}
                  </span>
                  {hasTask && !isSelected && <div style={styles.rIndicator}>R</div>}
                  {isToday && !isSelected && <div style={styles.todayIndicator}></div>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.taskSection}>
          <div style={styles.sectionHeader}>
            <CalendarIcon size={18} color="#7b4dff" />
            <h4 style={styles.sectionTitle}>
              {selectedDate === new Date().toISOString().split("T")[0] ? "Today" : selectedDate}
            </h4>
          </div>

          <AnimatePresence mode="wait">
            {filteredTasks.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={styles.emptyCard}
              >
                <div style={styles.emptyIcon}>😌</div>
                <p style={styles.emptyText}>Nothing scheduled. Peak laziness achieved!</p>
              </motion.div>
            ) : (
              <div style={styles.taskList}>
                {filteredTasks.map((task, idx) => (
                  <motion.div 
                    key={task.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={styles.taskItem}
                  >
                    <CheckCircle2 size={18} color="#7b4dff" style={{ marginTop: 2 }} />
                    <div>
                      <p style={styles.taskTitle}>{task.title}</p>
                      <p style={styles.taskSubtitle}>{task.description}</p>
                      {task.tags && (
                        <div style={styles.tagGroup}>
                          {(Array.isArray(task.tags) ? task.tags : (task.tags?.split?.(",") || [])).map(t => t.trim()).filter(t => t.length > 0).map((tag, tIdx) => (
                            <span key={`${task.id}-tag-${tIdx}`} style={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { 
    backgroundColor: "transparent", 
    minHeight: "100vh",
    overflowX: "hidden"
  },
  content: { 
    padding: "20px", 
    paddingBottom: "120px" 
  },
  calendarCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(16px)",
    padding: "24px",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "20px" 
  },
  monthTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    fontFamily: "var(--font-display)",
    letterSpacing: "0.5px"
  },
  navBtn: { 
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px", 
    border: "none", 
    backgroundColor: "rgba(123, 77, 255, 0.15)", 
    color: "#7b4dff", 
    cursor: "pointer" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(7, 1fr)", 
    rowGap: "10px",
    columnGap: "8px"
  },
  dayHeaderLabel: { 
    textAlign: "center", 
    fontWeight: "800", 
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: "10px"
  },
  cell: { 
    height: "45px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: "14px", 
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
    color: "#fff",
    fontWeight: "600"
  },
  rIndicator: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "10px",
    fontWeight: "900",
    color: "#7b4dff",
    textShadow: "0 0 5px rgba(123,77,255,0.5)"
  },
  todayIndicator: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#ff4d4d",
    border: "2px solid rgba(255,255,255,0.5)"
  },
  taskSection: {
    marginTop: "30px"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    paddingLeft: "5px"
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  taskItem: {
    display: "flex",
    gap: "12px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 4px 0"
  },
  taskSubtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    lineHeight: "1.5"
  },
  tagGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap"
  },
  tag: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#fff",
    backgroundColor: "rgba(123, 77, 255, 0.2)",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(123, 77, 255, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  emptyCard: {
    padding: "50px 20px",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: "28px",
    border: "1.5px dashed rgba(255, 255, 255, 0.1)"
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "15px",
    opacity: 0.5
  },
  emptyText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    margin: 0
  }
};

export default Calendar;
