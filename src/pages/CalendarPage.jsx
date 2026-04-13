import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameDay } from "date-fns"
import { useAuth } from "../context/AuthContext"
import { useTasks } from "../hooks/useTasks"
import TaskCard from "../components/TaskCard"
import AddTaskModal from "../components/AddTaskModal"

export default function CalendarPage() {
  const { user } = useAuth()
  const { tasks, addTask, deleteTask, toggleDone } = useTasks(user?.uid)
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(new Date())
  const [showModal, setShowModal] = useState(false)

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = (getDay(monthStart) + 6) % 7

  const tasksOn = (day) => tasks.filter((t) => t.date === day.toISOString().split("T")[0])
  const selStr = selected.toISOString().split("T")[0]
  const selTasks = tasks.filter((t) => t.date === selStr)

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.8rem", color: "var(--text)", marginBottom: "1.5rem" }}>
          Calendar 🗓
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card" style={{ marginBottom: "1.5rem" }}
      >
        {/* Month nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setCurrent(subMonths(current, 1))}>‹</button>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
            {format(current, "MMMM yyyy")}
          </span>
          <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setCurrent(addMonths(current, 1))}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6px" }}>
          {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--muted)", fontWeight: 700, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map((day) => {
            const dt = tasksOn(day)
            const isSel = isSameDay(selected, day)
            const isTod = isToday(day)
            return (
              <div key={day.toISOString()} onClick={() => setSelected(day)}
                style={{
                  aspectRatio: "1", borderRadius: "50%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  background: isSel ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : isTod ? "var(--bg2)" : "transparent",
                  color: isSel ? "#fff" : "var(--text)",
                  fontSize: "0.82rem", fontWeight: isTod ? 800 : 500,
                  border: isTod && !isSel ? "2px solid var(--primary)" : "none",
                  transition: "all 0.2s", position: "relative",
                }}
              >
                {format(day, "d")}
                {dt.length > 0 && (
                  <div style={{
                    position: "absolute", bottom: "3px",
                    width: 5, height: 5, borderRadius: "50%",
                    background: isSel ? "#fff" : "var(--primary)",
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Selected day */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
            {format(selected, "EEEE, MMMM d")}
          </h2>
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            + Add
          </button>
        </div>

        <AnimatePresence>
          {selTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              <p style={{ fontSize: "0.85rem" }}>No tasks for this day 🌸</p>
            </div>
          ) : (
            selTasks.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={toggleDone} onDelete={deleteTask} />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} defaultDate={selStr} />
        )}
      </AnimatePresence>
    </div>
  )
}
