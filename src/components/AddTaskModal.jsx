import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
  { id: "work",     label: "Work",     icon: "💼", cls: "cat-work"    },
  { id: "food",     label: "Food",     icon: "🍕", cls: "cat-food"    },
  { id: "sport",    label: "Sport",    icon: "🏃", cls: "cat-sport"   },
  { id: "idea",     label: "Idea",     icon: "💡", cls: "cat-idea"    },
  { id: "music",    label: "Music",    icon: "🎵", cls: "cat-music"   },
  { id: "personal", label: "Personal", icon: "🌸", cls: "cat-personal"},
]

const priorities = [
  { id: "high",   label: "High",   cls: "badge-high"   },
  { id: "medium", label: "Medium", cls: "badge-medium" },
  { id: "low",    label: "Low",    cls: "badge-low"    },
]

export default function AddTaskModal({ onClose, onAdd, defaultDate }) {
  const [form, setForm] = useState({
    title: "", desc: "", category: "work",
    priority: "medium", date: defaultDate || new Date().toISOString().split("T")[0],
    time: "09:00", reminder: false,
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await onAdd(form)
    onClose()
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", borderRadius: "24px 24px 0 0",
          padding: "1.5rem", width: "100%", maxWidth: "600px",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 1.5rem" }} />

        <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", marginBottom: "1.25rem" }}>
          Create Task ✦
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Title */}
          <input className="input" placeholder="Task title..." value={form.title}
            onChange={(e) => set("title", e.target.value)} required />

          {/* Description */}
          <textarea className="input" placeholder="Description (optional)..." rows={2}
            value={form.desc} onChange={(e) => set("desc", e.target.value)}
            style={{ resize: "none" }} />

          {/* Category */}
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 }}>Category</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => set("category", c.id)}
                  className={c.cls}
                  style={{
                    padding: "6px 14px", borderRadius: "50px", cursor: "pointer",
                    border: form.category === c.id ? "2px solid var(--primary)" : "2px solid transparent",
                    fontWeight: 700, fontSize: "0.82rem",
                    transition: "all 0.2s",
                  }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 }}>Priority</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {priorities.map((p) => (
                <button key={p.id} type="button" onClick={() => set("priority", p.id)}
                  className={p.cls}
                  style={{
                    padding: "6px 16px", cursor: "pointer",
                    border: form.priority === p.id ? "2px solid var(--text)" : "2px solid transparent",
                    fontWeight: 700, transition: "all 0.2s",
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "4px", fontWeight: 600 }}>Date</p>
              <input className="input" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "4px", fontWeight: 600 }}>Time</p>
              <input className="input" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>

          {/* Reminder */}
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <div onClick={() => set("reminder", !form.reminder)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: form.reminder ? "var(--primary)" : "var(--border)",
                position: "relative", transition: "background 0.3s", cursor: "pointer",
              }}>
              <div style={{
                position: "absolute", top: 3, left: form.reminder ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.3s",
              }} />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
              🔔 Enable Reminder
            </span>
          </label>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
            <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>Create Task ✦</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
