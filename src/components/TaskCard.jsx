import { useState } from "react"
import { motion } from "framer-motion"

const catMap = {
  work:     { icon: "💼", cls: "cat-work"    },
  food:     { icon: "🍕", cls: "cat-food"    },
  sport:    { icon: "🏃", cls: "cat-sport"   },
  idea:     { icon: "💡", cls: "cat-idea"    },
  music:    { icon: "🎵", cls: "cat-music"   },
  personal: { icon: "🌸", cls: "cat-personal"},
}

export default function TaskCard({ task, onToggle, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const cat = catMap[task.category] || catMap.idea

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(task.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: deleting ? 0 : 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 16px",
        background: task.done ? "var(--bg2)" : "var(--surface)",
        borderRadius: "16px",
        border: `1px solid ${task.done ? "var(--border)" : "var(--border)"}`,
        marginBottom: "10px",
        boxShadow: task.done ? "none" : "var(--card-shadow)",
        transition: "all 0.3s",
        opacity: task.done ? 0.7 : 1,
      }}
    >
      {/* Checkbox */}
      <div
        onClick={() => onToggle(task)}
        style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${task.done ? "var(--success)" : "var(--primary-light)"}`,
          background: task.done ? "var(--success)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.25s",
        }}
      >
        {task.done && <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>✓</span>}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <span style={{
            fontSize: "0.92rem", fontWeight: 700, color: "var(--text)",
            textDecoration: task.done ? "line-through" : "none",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {task.title}
          </span>
          <span className={`badge-${task.priority}`}>{task.priority}</span>
        </div>

        {task.desc && (
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {task.desc}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className={cat.cls} style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>
            {cat.icon} {task.category}
          </span>
          {task.time && (
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>🕐 {task.time}</span>
          )}
          {task.reminder && (
            <span style={{ fontSize: "0.72rem", color: "var(--warning)" }}>🔔</span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button onClick={handleDelete}
        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "16px", padding: "4px", borderRadius: "8px", transition: "color 0.2s" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
      >
        ✕
      </button>
    </motion.div>
  )
}
