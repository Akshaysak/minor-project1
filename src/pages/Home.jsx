import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { motion } from "motion/react";
import { CheckCircle, Clock, Calendar, Lightbulb, Bell, Sparkles, Plus, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { getSlothWisdom } from "../services/gemini";

function Home() {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("friend");
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [tip, setTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const [todayDate, setTodayDate] = useState("");
  const [dayDone, setDayDone] = useState(false);
  const [reminderInput, setReminderInput] = useState("");

  useEffect(() => {
    // ... rest of useEffect
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setTodayDate(todayStr);

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    if (storedUser.name) setUserName(storedUser.name.split(" ")[0]);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    const storedDoneDate = localStorage.getItem("last_done_date");

    setTasks(storedTasks);
    setSchedule(storedSchedule);
    if (storedDoneDate === todayStr) {
      setDayDone(true);
    }

    refreshTip();
  }, []);

  const refreshTip = async () => {
    setLoadingTip(true);
    const newTip = await getSlothWisdom();
    setTip(newTip);
    setLoadingTip(false);
  };

  const resetSession = () => {
    localStorage.removeItem("schedule");
    localStorage.removeItem("last_done_date");
    localStorage.removeItem("temp_scheduler_tasks");
    setSchedule([]);
    setDayDone(false);
    window.location.reload(); // Refresh to sync everything cleanly
  };

  const addQuickReminder = () => {
    if (!reminderInput.trim()) return;
    
    const newReminder = {
      id: `task-${Date.now()}`,
      title: reminderInput,
      description: "Quick reminder from Home",
      dueDate: todayDate,
      tags: "Reminder",
      completed: false
    };

    const updatedTasks = [newReminder, ...tasks];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setReminderInput("");
  };

  const handleDayDone = () => {
    setDayDone(true);
    localStorage.setItem("last_done_date", todayDate);
    
    // Party Pooper Animation
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#5b2cff', '#7b4dff', '#fffd82']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#5b2cff', '#7b4dff', '#fffd82']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5b2cff', '#7b4dff', '#fffd82']
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  };

  const nextTask = schedule.find((item) => {
    if (!item || !item.time) return false;
    const parts = item.time.split(" - ");
    if (parts.length < 2) return false;
    const start = parts[0];
    const end = parts[1];
    
    const parseTime = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h + m / 60;
    };

    const startTime = parseTime(start);
    const endTime = parseTime(end);
    const nowTime = getCurrentTime();

    // Upcoming or Currently Ongoing
    return nowTime < endTime;
  });

  const todayTasks = tasks.filter(task => task.dueDate === todayDate);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={styles.container} className="no-scrollbar">
      <TopBar title="Laziness Planner" />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={styles.content}
      >
        <motion.div variants={itemVariants} style={styles.headerSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={styles.greeting}>{greeting}, {userName}! 👋</h2>
              <p style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            {schedule.length > 0 && !dayDone && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDayDone}
                style={styles.doneBtn}
              >
                Done
              </motion.button>
            )}
            {dayDone && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.doneBadge}>
                <Sparkles size={16} style={{ marginRight: 4 }} />
                Day Done
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 🔥 Next Task (SMART CARD) */}
        {!dayDone && (
          <motion.div variants={itemVariants} style={styles.card}>
            <div style={styles.cardHeader}>
              <Clock size={20} color="#5b2cff" />
              <h3 style={styles.cardTitle}>Next Duty</h3>
            </div>
            {!nextTask ? (
              <p style={styles.cardText}>You're done for the day 😎. Time for a guilt-free nap!</p>
            ) : (
              <div style={{
                ...styles.taskItemActive,
                backgroundColor: getCurrentTime() >= (nextTask.time.split(" - ")[0].split(":").map(Number)[0] + nextTask.time.split(" - ")[0].split(":").map(Number)[1]/60) ? "rgba(123,77,255,0.1)" : "transparent",
                border: getCurrentTime() >= (nextTask.time.split(" - ")[0].split(":").map(Number)[0] + nextTask.time.split(" - ")[0].split(":").map(Number)[1]/60) ? "1.5px solid rgba(123,77,255,0.4)" : "1.5px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={styles.timeTag}>{nextTask.time.split(" - ")[0]}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: getCurrentTime() >= (nextTask.time.split(" - ")[0].split(":").map(Number)[0] + nextTask.time.split(" - ")[0].split(":").map(Number)[1]/60) ? "#7b4dff" : "rgba(255,255,255,0.4)"
                  }}>
                    {getCurrentTime() >= (nextTask.time.split(" - ")[0].split(":").map(Number)[0] + nextTask.time.split(" - ")[0].split(":").map(Number)[1]/60) ? "ONGOING" : "UPCOMING"}
                  </span>
                </div>
                <p style={styles.taskName}>{nextTask.task}</p>
              </div>
            )}
          </motion.div>
        )}

        {dayDone && (
          <motion.div variants={itemVariants} style={styles.congratsCard}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🥳</div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800' }}>Incredible Laziness!</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: '5px 0 20px 0' }}>
              You've successfully managed your day with zero stress. The Sloth colony is proud of you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSession}
              style={styles.resetBtn}
            >
              Plan a New Day
            </motion.button>
          </motion.div>
        )}

        {/* 🔥 Today's Plan */}
        <motion.div variants={itemVariants} style={styles.card}>
          <div style={styles.cardHeader}>
            <Calendar size={20} color="#7b4dff" />
            <h3 style={styles.cardTitle}>Daily Pacing</h3>
          </div>
          {schedule.length === 0 ? (
            <p style={styles.cardText}>No schedule generated yet. Head to the Scheduler tab!</p>
          ) : (
            <div style={styles.list}>
              {schedule.map((item, index) => (
                <div key={index} style={{
                  ...styles.listItem,
                  opacity: dayDone ? 0.5 : 1,
                  textDecoration: dayDone ? 'line-through' : 'none'
                }}>
                  <span style={styles.listTime}>{item.time.split(" - ")[0]}</span>
                  <span style={styles.listTask}>{item.task}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Proper Reminder */}
        <motion.div variants={itemVariants} style={styles.card}>
          <div style={styles.cardHeader}>
            <Bell size={20} color="#7b4dff" />
            <h3 style={styles.cardTitle}>Reminders (Today)</h3>
          </div>
          
          <div style={styles.addReminderRow}>
            <input 
              style={styles.reminderInput}
              placeholder="Quick reminder..."
              value={reminderInput}
              onChange={(e) => setReminderInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addQuickReminder()}
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              style={styles.addReminderBtn}
              onClick={addQuickReminder}
            >
              <Plus size={16} />
            </motion.button>
          </div>

          {todayTasks.length === 0 ? (
            <p style={styles.cardText}>No tasks due today. Enjoy your freedom!</p>
          ) : (
            <div style={styles.list}>
              {todayTasks.map((task) => (
                <div key={task.id} style={styles.reminderItem}>
                  <CheckCircle size={16} color={dayDone ? "#7b4dff" : "rgba(255,255,255,0.2)"} />
                  <span style={{
                    ...styles.reminderText,
                    textDecoration: dayDone ? 'line-through' : 'none',
                    opacity: dayDone ? 0.6 : 1
                  }}>{task.title}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Lazy Tip */}
        <motion.div variants={itemVariants} style={styles.cardTip}>
          <div style={{...styles.cardHeader, justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Lightbulb size={20} color="#fff" />
              <h3 style={{...styles.cardTitle, color: '#fff'}}>Daily Insight</h3>
            </div>
            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={refreshTip}
              disabled={loadingTip}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.8 }}
            >
              <RefreshCw size={16} className={loadingTip ? "animate-spin" : ""} />
            </motion.button>
          </div>
          <p style={styles.tipText}>
            {loadingTip ? "Consulting behavior patterns..." : `"${tip}"`}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "transparent",
    minHeight: "100vh"
  },
  content: {
    padding: "20px",
    paddingBottom: "120px"
  },
  headerSection: {
    marginBottom: "30px",
    marginTop: "20px"
  },
  greeting: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.5px"
  },
  dateText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "4px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  doneBtn: {
    backgroundColor: "#7b4dff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(123,77,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  doneBadge: {
    backgroundColor: "rgba(123,77,255,0.2)",
    color: "#7b4dff",
    padding: "8px 16px",
    borderRadius: "14px",
    fontSize: "12px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(123,77,255,0.3)"
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(16px)",
    padding: "24px",
    borderRadius: "28px",
    margin: "20px 0",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  congratsCard: {
    background: "linear-gradient(135deg, #7b4dff 0%, #5b2cff 100%)",
    padding: "30px",
    borderRadius: "28px",
    margin: "20px 0",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(91,44,255,0.3)",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  resetBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    padding: "12px 24px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    marginTop: "20px"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px"
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    opacity: 0.8
  },
  cardText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    lineHeight: "1.6"
  },
  taskItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    backdropFilter: "blur(5px)"
  },
  timeTag: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  taskName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#fff",
    margin: 0
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s"
  },
  addReminderRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px"
  },
  reminderInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "14px 20px",
    fontSize: "14px",
    outline: "none",
    color: "#fff",
    transition: "all 0.3s"
  },
  addReminderBtn: {
    backgroundColor: "#7b4dff",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    width: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(123,77,255,0.2)"
  },
  listTime: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    width: "50px",
    textTransform: "uppercase"
  },
  listTask: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500"
  },
  reminderItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 0"
  },
  reminderText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500"
  },
  cardTip: {
    background: "rgba(123, 77, 255, 0.15)",
    backdropFilter: "blur(20px)",
    padding: "24px",
    borderRadius: "28px",
    margin: "20px 0",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(123, 77, 255, 0.3)"
  },
  tipText: {
    fontSize: "16px",
    color: "#fff",
    fontStyle: "italic",
    margin: 0,
    opacity: 0.9,
    lineHeight: "1.6",
    fontWeight: "500"
  }
};

export default Home;
