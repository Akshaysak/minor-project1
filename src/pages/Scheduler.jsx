import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Plus, Sparkles, Coffee, Brain, Clock, Sun, Moon, Wand2 } from "lucide-react";
import { suggestPacedSchedule } from "../services/gemini";

function Scheduler() {
  const [wakeTime, setWakeTime] = useState("08:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [tasks, setTasks] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [breakDuration, setBreakDuration] = useState(15); // in minutes
  const [isAiLoading, setIsAiLoading] = useState(false);

  // ... rest of component
  const generateAiSchedule = async () => {
    if (tasks.length === 0) {
      alert("Add some tasks first so the AI can balance them!");
      return;
    }
    setIsAiLoading(true);
    const aiSchedule = await suggestPacedSchedule(tasks, wakeTime, sleepTime);
    if (aiSchedule) {
      setGenerated(aiSchedule);
      localStorage.setItem("schedule", JSON.stringify(aiSchedule));
    } else {
      alert("AI was too lazy to respond. Try the manual generator!");
    }
    setIsAiLoading(false);
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("temp_scheduler_tasks")) || [];
    setTasks(savedTasks);
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    setGenerated(savedSchedule);
  }, []);

  const addTask = () => {
    if (!taskName || !taskDuration) return;
    const newTask = {
      id: Date.now(),
      name: taskName,
      duration: parseFloat(taskDuration)
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("temp_scheduler_tasks", JSON.stringify(updatedTasks));
    setTaskName("");
    setTaskDuration("");
  };

  const removeTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("temp_scheduler_tasks", JSON.stringify(updatedTasks));
  };

  const timeToNumber = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
  };

  const numberToTime = (num) => {
    const h = Math.floor(num) % 24;
    const m = Math.round((num - Math.floor(num)) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const generateSchedule = () => {
    if (!wakeTime || !sleepTime || tasks.length === 0) {
      alert("Please set wake/sleep times and add at least one task.");
      return;
    }
    
    let start = timeToNumber(wakeTime);
    let end = timeToNumber(sleepTime);
    
    // Handle overnight schedules
    if (end <= start) end += 24;

    let schedule = [];
    const BREAK_VAL = breakDuration / 60;
    const BUFFER = 0.1; // ~6 min buffer per task

    let current = start;
    tasks.forEach((task, index) => {
      let taskEnd = current + task.duration + BUFFER;
      
      if (taskEnd > end) return;

      schedule.push({
        type: "task",
        task: task.name,
        time: `${numberToTime(current)} - ${numberToTime(taskEnd)}`
      });

      current = taskEnd;

      if (index !== tasks.length - 1) {
        let breakEnd = current + BREAK_VAL;
        if (breakEnd <= end) {
          schedule.push({
            type: "break",
            task: "Chill / Break",
            time: `${numberToTime(current)} - ${numberToTime(breakEnd)}`
          });
          current = breakEnd;
        }
      }
    });

    setGenerated(schedule);
    localStorage.setItem("schedule", JSON.stringify(schedule));
  };

  return (
    <div style={styles.container}>
      <TopBar title="Laziness Mode" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.content}
      >
        {/* Time Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Clock size={20} color="#5b2cff" />
            <h3 style={styles.cardTitle}>Routine Settings</h3>
          </div>
          <div style={styles.timeRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Sun size={14} style={{display:'inline', marginRight: 4}}/> Wake Up</label>
              <input
                type="time"
                style={styles.input}
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Moon size={14} style={{display:'inline', marginRight: 4}}/> Sleep</label>
              <input
                type="time"
                style={styles.input}
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gap between tasks (minutes)</label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
              style={styles.range}
            />
            <div style={{textAlign: 'right', fontSize: '12px', color: '#666'}}>{breakDuration} mins</div>
          </div>
        </div>

        {/* Task Input */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Brain size={20} color="#7b4dff" />
            <h3 style={styles.cardTitle}>What's the plan?</h3>
          </div>
          <div style={styles.taskRow}>
            <input
              style={{...styles.input, flex: 2}}
              placeholder="e.g. Read Manga"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Hrs"
              style={{ ...styles.input, width: "65px" }}
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
            />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              style={styles.addBtn} 
              onClick={addTask}
            >
              <Plus size={20} />
            </motion.button>
          </div>

          <div style={styles.taskList}>
            <AnimatePresence>
              {tasks.length === 0 ? (
                <p style={styles.placeholder}>Add tasks to distribute them lazily...</p>
              ) : (
                tasks.map((t) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={styles.taskItem}
                  >
                    <span>{t.name} ({t.duration}h)</span>
                    <Trash2 size={16} color="#ff4d4d" style={{cursor: 'pointer'}} onClick={() => removeTask(t.id)} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.generateBtn} 
            onClick={generateSchedule}
            disabled={isAiLoading}
          >
            <Sparkles size={20} style={{marginRight: 8}}/>
            Manual
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ ...styles.generateBtn, background: 'linear-gradient(135deg, #7b4dff 0%, #a66cff 100%)' }} 
            onClick={generateAiSchedule}
            disabled={isAiLoading}
          >
            <Wand2 size={20} style={{marginRight: 8}} className={isAiLoading ? "animate-pulse" : ""}/>
            {isAiLoading ? "Optimizing..." : "Smart Optimize"}
          </motion.button>
        </div>

        {/* Results */}
        {generated.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.card}
          >
            <h3 style={{...styles.cardTitle, marginBottom: 15}}>Your Paced Flow</h3>
            <div style={styles.flowList}>
              {generated.map((item, index) => (
                <div key={index} style={{
                  ...styles.flowItem,
                  backgroundColor: item.type === "break" ? "rgba(123,77,255,0.1)" : "rgba(255,255,255,0.05)",
                  borderLeft: item.type === "break" ? "4px solid #7b4dff" : "4px solid rgba(255,255,255,0.2)"
                }}>
                  <div style={styles.flowTime}>{item.time}</div>
                  <div style={styles.flowTask}>
                    {item.type === "break" ? <Coffee size={14} style={{display:'inline', marginRight:8}} /> : <Brain size={14} style={{display:'inline', marginRight:8}} />}
                    {item.task}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  container: { 
    backgroundColor: "transparent", 
    minHeight: "100vh" 
  },
  content: { padding: "20px", paddingBottom: "120px" },
  card: { 
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(16px)",
    padding: "24px", 
    borderRadius: "28px", 
    marginTop: "20px", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
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
  timeRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },
  inputGroup: { 
    flex: 1,
    marginTop: "5px" 
  },
  label: { 
    fontSize: "11px", 
    fontWeight: "800", 
    color: "#7b4dff", 
    marginBottom: "8px", 
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  input: { 
    width: "100%", 
    padding: "14px", 
    borderRadius: "16px", 
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "14px",
    outline: "none",
    color: "#fff",
    transition: "border-color 0.2s"
  },
  range: {
    width: "100%",
    accentColor: "#7b4dff"
  },
  taskRow: { 
    display: "flex", 
    gap: "12px", 
    marginBottom: "20px" 
  },
  addBtn: { 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "54px",
    height: "54px",
    borderRadius: "16px", 
    backgroundColor: "#7b4dff", 
    color: "#fff", 
    border: "none", 
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(123,77,255,0.2)"
  },
  generateBtn: {
    width: "100%", 
    padding: "18px", 
    background: "linear-gradient(135deg, #7b4dff 0%, #5b2cff 100%)",
    color: "#fff", 
    border: "none", 
    borderRadius: "24px", 
    marginTop: "30px", 
    cursor: "pointer", 
    fontWeight: "800",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(91,44,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  taskList: {
    marginTop: "10px",
    maxHeight: "250px",
    overflowY: "auto"
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    marginBottom: "12px",
    fontSize: "15px",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  placeholder: {
    textAlign: "center",
    color: "rgba(255,255,255,0.3)",
    fontSize: "14px",
    padding: "30px 0"
  },
  flowList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  flowItem: {
    padding: "20px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },
  flowTime: {
    fontSize: "12px",
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px"
  },
  flowTask: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    display: "flex",
    alignItems: "center"
  }
};

export default Scheduler;
