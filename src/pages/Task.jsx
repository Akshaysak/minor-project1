import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Calendar, Tag, FileText, CheckCircle, Clock } from "lucide-react";

function Task() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [dailyPlan, setDailyPlan] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    setTaskList(storedTasks);
    setDailyPlan(storedSchedule);
  }, []);

  const tagOptions = ["Product Design", "UI Design", "Web Design", "Development"];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddTask = () => {
    if (!title || !dueDate) {
      alert("A title and due date are required for accurate tracking.");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      dueDate,
      tags: tags.length > 0 ? tags.join(", ") : "",
      completed: false
    };

    const updatedTasks = [newTask, ...taskList];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTaskList(updatedTasks);
    
    // Clear inputs
    setTitle("");
    setDescription("");
    setDueDate("");
    setTags([]);
  };

  const toggleComplete = (id) => {
    const updatedTasks = taskList.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTaskList(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = taskList.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTaskList(updatedTasks);
  };

  return (
    <div style={styles.container} className="no-scrollbar">
      <TopBar title="Lazy Log" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.content}
      >
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <Plus size={20} color="#7b4dff" />
            <h3 style={styles.cardTitle}>New Duty</h3>
          </div>
          
          <div style={styles.inputWrapper}>
            <FileText size={18} color="rgba(255,255,255,0.3)" />
            <input
              style={styles.input}
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={styles.inputWrapper}>
            <textarea
              style={styles.textarea}
              placeholder="Any details? (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.inputWrapper}>
            <Calendar size={18} color="rgba(255,255,255,0.3)" />
            <input
              type="date"
              style={styles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={styles.tagSection}>
            <div style={styles.rowLead}>
              <Tag size={16} color="rgba(255,255,255,0.3)" />
              <span style={styles.label}>Select Tags</span>
            </div>
            <div style={styles.tags}>
              {tagOptions.map((tag) => (
                <motion.span
                  key={tag}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    ...styles.tag,
                    backgroundColor: tags.includes(tag) ? "#5b2cff" : "#f5f5f5",
                    color: tags.includes(tag) ? "#fff" : "#666",
                    border: tags.includes(tag) ? "1.5px solid #5b2cff" : "1.5px solid #eee"
                  }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.button} 
            onClick={handleAddTask}
          >
            Log Task to History
          </motion.button>
        </div>

        <div style={styles.listHeader}>
          <h3 style={styles.listTitle}>Today's Schedule</h3>
          <span style={styles.taskCount}>{dailyPlan.length}</span>
        </div>

        <div style={styles.taskList}>
          {dailyPlan.length === 0 ? (
            <p style={styles.emptyText}>No schedule for today. Head to Scheduler!</p>
          ) : (
            dailyPlan.map((item, idx) => (
              <motion.div 
                key={`plan-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.taskCard}
              >
                <div style={styles.taskHeader}>
                  <div style={styles.taskTitleGroup}>
                    <Clock size={18} color="#7b4dff" />
                    <h4 style={styles.taskTitle}>{item.task}</h4>
                  </div>
                  <span style={styles.timeTag}>{item.time.split(" - ")[0]}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div style={styles.listHeader}>
          <h3 style={styles.listTitle}>Outstanding Duties</h3>
          <span style={styles.taskCount}>{taskList.length}</span>
        </div>

        <div style={styles.taskList}>
          <AnimatePresence mode="popLayout">
            {taskList.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.emptyText}
              >
                No active commitments found.
              </motion.p>
            ) : (
              taskList.map((task, idx) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    ...styles.taskCard,
                    opacity: task.completed ? 0.6 : 1,
                    backgroundColor: task.completed ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={styles.taskHeader}>
                    <div 
                      style={styles.taskTitleGroup} 
                      onClick={() => toggleComplete(task.id)}
                    >
                      <CheckCircle 
                        size={20} 
                        color={task.completed ? "#7b4dff" : "rgba(255,255,255,0.3)"} 
                        fill={task.completed ? "rgba(123,77,255,0.2)" : "transparent"}
                        style={{ cursor: 'pointer' }}
                      />
                      <h4 style={{
                        ...styles.taskTitle,
                        textDecoration: task.completed ? "line-through" : "none",
                        color: task.completed ? "rgba(255,255,255,0.4)" : "#fff"
                      }}>{task.title}</h4>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      style={styles.deleteBtn} 
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                  
                  {task.description && (
                    <p style={styles.taskDesc}>{task.description}</p>
                  )}

                  <div style={styles.taskFooter}>
                    <div style={styles.taskDate}>
                      <Calendar size={12} color="rgba(255,255,255,0.4)" />
                      <span>{task.dueDate}</span>
                    </div>
                    <div style={styles.taskTags}>
                      {(Array.isArray(task.tags) ? task.tags : (task.tags?.split?.(",") || [])).map(t => t.trim()).filter(t => t.length > 0).map((tag, tIdx) => (
                        <span key={`${task.id}-tag-${tIdx}`} style={styles.taskTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
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
    minHeight: "100vh"
  },
  content: {
    padding: "20px",
    paddingBottom: "120px"
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(16px)",
    padding: "24px",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  sectionHeader: {
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
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "0 15px",
    borderRadius: "16px",
    margin: "10px 0",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  input: {
    flex: 1,
    padding: "14px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#fff"
  },
  textarea: {
    width: "100%",
    padding: "14px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    minHeight: "80px",
    resize: "none",
    color: "#fff"
  },
  tagSection: {
    marginTop: "15px",
    marginBottom: "20px"
  },
  rowLead: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    paddingLeft: "4px"
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#7b4dff",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  tag: {
    padding: "8px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  button: {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(135deg, #7b4dff 0%, #5b2cff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 10px 30px rgba(91,44,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "40px",
    marginBottom: "20px",
    padding: "0 10px"
  },
  listTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  },
  taskCount: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#fff",
    backgroundColor: "#7b4dff",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(123,77,255,0.3)"
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  taskCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    padding: "24px",
    borderRadius: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px"
  },
  taskTitleGroup: {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },
  taskTitle: {
    fontSize: "17px",
    fontWeight: "700",
    margin: 0,
    color: "#fff"
  },
  deleteBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#ff4d4d",
    border: "1px solid rgba(255,77,77,0.2)",
    borderRadius: "12px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  taskDesc: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "20px",
    lineHeight: "1.6",
    paddingLeft: "32px"
  },
  taskFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingLeft: "32px"
  },
  taskDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  taskTags: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  taskTag: {
    fontSize: "10px",
    fontWeight: "800",
    backgroundColor: "rgba(123, 77, 255, 0.2)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(123, 77, 255, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  emptyText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.3)",
    fontSize: "15px",
    fontStyle: "italic",
    padding: "60px 0"
  },
  timeTag: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#7b4dff",
    backgroundColor: "rgba(123, 77, 255, 0.1)",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(123, 77, 255, 0.2)"
  }
};

export default Task;
