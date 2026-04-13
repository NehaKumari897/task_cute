import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, startOfWeek, addDays, isToday } from "date-fns"
import { useAuth } from "../context/AuthContext"
import { useTasks } from "../hooks/useTasks"
import TaskCard from "../components/TaskCard"
import AddTaskModal from "../components/AddTaskModal"

export default function Weekly() {
  const { user } = useAuth()
  const { tasks, addTask, deleteTask, toggleDone } = useTasks(user?.uid)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [weekOffset, setWeekOffset] = useState(0)

  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7)
  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const tasksForDay = (day) => {
    const dStr = day.toISOString().split("T")[0]
    return tasks.filter((t) => t.date === dStr)
  }

  const sel = selectedDate || weekDays[0]
  const selStr = sel.toISOString().split("T")[0]
  const selTasks = tasks.filter((t) => t.date === selStr)

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
      >
        <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.8rem", color: "var(--text)" }}>
          Weekly 📅
        </h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setWeekOffset(weekOffset - 1)}>‹</button>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
            {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d")}
          </span>
          <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setWeekOffset(weekOffset + 1)}>›</button>
        </div>
      </motion.div>

      {/* Week grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "1.5rem" }}
      >
        {weekDays.map((day, i) => {
          const dt = tasksForDay(day)
          const done = dt.filter((t) => t.done).length
          const isSelected = day.toISOString().split("T")[0] === sel.toISOString().split("T")[0]
          const isTod = isToday(day)
          return (
            <div key={i} onClick={() => setSelectedDate(day)}
              className="card"
              style={{
                textAlign: "center", padding: "12px 6px", cursor: "pointer",
                background: isSelected ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "var(--surface)",
                color: isSelected ? "#fff" : "var(--text)",
                border: isTod && !isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                boxShadow: isSelected ? "0 8px 20px rgba(124,58,237,0.3)" : "var(--card-shadow)",
              }}
            >
              <p style={{ fontSize: "0.68rem", fontWeight: 700, marginBottom: "4px", opacity: isSelected ? 0.85 : 1 }}>
                {format(day, "EEE")}
              </p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800 }}>{format(day, "d")}</p>
              {dt.length > 0 && (
                <p style={{ fontSize: "0.65rem", marginTop: "4px", opacity: 0.85 }}>
                  {done}/{dt.length}
                </p>
              )}
            </div>
          )
        })}
      </motion.div>

      {/* Selected day tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
            {format(sel, "EEEE, MMMM d")}
          </h2>
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            + Add
          </button>
        </div>

        <AnimatePresence>
          {selTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              <p style={{ fontSize: "1.8rem" }}>📋</p>
              <p style={{ fontSize: "0.85rem" }}>No tasks for this day</p>
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
          <AddTaskModal
            onClose={() => setShowModal(false)}
            onAdd={addTask}
            defaultDate={selStr}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
