import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { useTasks } from "../hooks/useTasks"
import TaskCard from "../components/TaskCard"
import AddTaskModal from "../components/AddTaskModal"

const categories = [
  { id: "all",      label: "All",      icon: "✦",  cls: ""           },
  { id: "work",     label: "Work",     icon: "💼",  cls: "cat-work"   },
  { id: "food",     label: "Food",     icon: "🍕",  cls: "cat-food"   },
  { id: "sport",    label: "Sport",    icon: "🏃",  cls: "cat-sport"  },
  { id: "idea",     label: "Idea",     icon: "💡",  cls: "cat-idea"   },
  { id: "music",    label: "Music",    icon: "🎵",  cls: "cat-music"  },
  { id: "personal", label: "Personal", icon: "🌸",  cls: "cat-personal"},
]

export default function Categories() {
  const { user } = useAuth()
  const { tasks, addTask, deleteTask, toggleDone } = useTasks(user?.uid)
  const [active, setActive] = useState("all")
  const [showModal, setShowModal] = useState(false)

  const filtered = active === "all" ? tasks : tasks.filter((t) => t.category === active)

  const countFor = (id) => id === "all" ? tasks.length : tasks.filter((t) => t.category === id).length

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
      >
        <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.8rem", color: "var(--text)" }}>
          Categories ✦
        </h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </motion.div>

      {/* Category cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}
      >
        {categories.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActive(c.id)}
            className="card"
            style={{
              textAlign: "center", padding: "1rem 0.75rem", cursor: "pointer",
              background: active === c.id ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "var(--surface)",
              color: active === c.id ? "#fff" : "var(--text)",
              border: active === c.id ? "none" : "1px solid var(--border)",
              boxShadow: active === c.id ? "0 8px 20px rgba(124,58,237,0.3)" : "var(--card-shadow)",
              transition: "all 0.25s",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{c.icon}</div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "2px" }}>{c.label}</div>
            <div style={{ fontSize: "0.72rem", opacity: active === c.id ? 0.85 : 0.6 }}>
              {countFor(c.id)} tasks
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "0.95rem", color: "var(--muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>
          {active === "all" ? "ALL TASKS" : active.toUpperCase()} · {filtered.length}
        </h2>

        <AnimatePresence>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</p>
              <p style={{ fontSize: "0.85rem" }}>No tasks in this category</p>
            </div>
          ) : (
            filtered.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={toggleDone} onDelete={deleteTask} />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />
        )}
      </AnimatePresence>
    </div>
  )
}
