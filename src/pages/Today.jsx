import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, parseISO } from "date-fns"
import { useAuth } from "../context/AuthContext"
import { useTasks } from "../hooks/useTasks"
import TaskCard from "../components/TaskCard"
import AddTaskModal from "../components/AddTaskModal"

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

export default function Today() {
  const { user } = useAuth()
  const { tasks, addTask, deleteTask, toggleDone } = useTasks(user?.uid)
  const [showModal, setShowModal] = useState(false)

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  // Show tasks for today
  const todayTasks = tasks.filter((t) => t.date === todayStr)
  const doneTasks  = todayTasks.filter((t) => t.done)
  const pendingTasks = todayTasks.filter((t) => !t.done)
  const pct = todayTasks.length > 0 ? Math.round((doneTasks.length / todayTasks.length) * 100) : 0

  // Week strip (Sun to Sat)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - today.getDay() + i)
    return d
  })

  const firstName = user?.displayName?.split(" ")[0] || "there"

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}
      >
        <div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 600 }}>
            {format(today, "EEEE, MMMM d")}
          </p>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.8rem", color: "var(--text)" }}>
            Today 👋
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            {todayTasks.length} tasks · {doneTasks.length} done
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          + Add New
        </button>
      </motion.div>

      {/* Week strip */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card" style={{ marginBottom: "1.25rem", padding: "1rem" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
          {weekDays.map((d, i) => {
            const dStr = d.toISOString().split("T")[0]
            const isTod = isToday(d)
            const hasTasks = tasks.some((t) => t.date === dStr)
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "4px", fontWeight: 600 }}>
                  {DAYS[d.getDay()]}
                </p>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", margin: "0 auto",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isTod ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "transparent",
                  color: isTod ? "#fff" : "var(--text)",
                  fontSize: "0.85rem", fontWeight: isTod ? 800 : 500,
                  border: !isTod && hasTasks ? "2px solid var(--primary-light)" : "none",
                  cursor: "pointer",
                }}>
                  {d.getDate()}
                </div>
                {hasTasks && !isTod && (
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)", margin: "3px auto 0" }} />
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Progress */}
      {todayTasks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card" style={{ marginBottom: "1.25rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Progress</span>
            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--primary)" }}>{pct}%</span>
          </div>
          <div style={{ background: "var(--bg2)", borderRadius: 8, height: 10, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ height: "100%", borderRadius: 8, background: "linear-gradient(90deg, var(--primary), var(--primary-light))" }}
            />
          </div>
          {pct === 100 && (
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--success)", marginTop: "8px", fontWeight: 700 }}>
              All done! Amazing work today! 🎉
            </p>
          )}
        </motion.div>
      )}

      {/* Pending tasks */}
      {pendingTasks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--muted)", marginBottom: "10px", letterSpacing: "0.05em" }}>
            PENDING · {pendingTasks.length}
          </h2>
          <AnimatePresence>
            {pendingTasks.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={toggleDone} onDelete={deleteTask} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Done tasks */}
      {doneTasks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginTop: "1rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--muted)", marginBottom: "10px", letterSpacing: "0.05em" }}>
            COMPLETED · {doneTasks.length}
          </h2>
          {doneTasks.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggleDone} onDelete={deleteTask} />
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {todayTasks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--muted)" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
          <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text)" }}>No tasks today!</p>
          <p style={{ fontSize: "0.85rem" }}>Click "+ Add New" to create your first task</p>
        </motion.div>
      )}

      {/* FAB on mobile */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden btn-primary"
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem",
          width: 56, height: 56, borderRadius: "50%",
          fontSize: "1.6rem", padding: 0,
          boxShadow: "0 8px 25px rgba(124,58,237,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >+</button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddTaskModal
            onClose={() => setShowModal(false)}
            onAdd={addTask}
            defaultDate={todayStr}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
