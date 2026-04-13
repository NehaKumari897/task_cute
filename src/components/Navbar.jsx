import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"

const links = [
  { to: "/",         label: "Today",    icon: "☀️" },
  { to: "/weekly",   label: "Weekly",   icon: "📅" },
  { to: "/calendar", label: "Calendar", icon: "🗓" },
  { to: "/categories", label: "Categories", icon: "✦" },
]

const themes = [
  { id: "purple",   color: "#7c3aed", label: "Purple" },
  { id: "colorful", color: "#ff6b6b", label: "Colorful" },
  { id: "dark",     color: "#1e1c2e", label: "Dark" },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate("/login") }

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
      padding: "0.75rem 1.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "var(--card-shadow)",
      transition: "all 0.3s ease",
    }}>
      {/* Logo */}
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--primary)" }}>
        Task<span style={{ color: "var(--text)" }}>Cute</span> ✨
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex" style={{ gap: "4px" }}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 16px", borderRadius: "50px",
              fontSize: "0.85rem", fontWeight: 700,
              textDecoration: "none",
              background: isActive ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "transparent",
              color: isActive ? "#fff" : "var(--muted)",
              transition: "all 0.2s",
            })}
          >
            <span style={{ fontSize: "13px" }}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* Right — themes + user */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Theme dots */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", background: "var(--bg2)", padding: "5px 10px", borderRadius: "50px" }}>
          {themes.map((t) => (
            <button key={t.id} title={t.label} onClick={() => setTheme(t.id)}
              style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: t.color, border: theme === t.id ? "3px solid var(--text)" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
                transform: theme === t.id ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {user && (
          <>
            <img src={user.photoURL} alt="" style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid var(--primary-light)" }} />
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: "5px 14px", fontSize: "0.8rem" }}>
              Logout
            </button>
          </>
        )}

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", fontSize: "1.4rem", color: "var(--text)", cursor: "pointer" }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: "var(--surface)", borderBottom: "1px solid var(--border)",
              padding: "1rem", display: "flex", flexDirection: "column", gap: "8px", zIndex: 99,
            }}
          >
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  padding: "10px 16px", borderRadius: "14px",
                  textDecoration: "none", fontSize: "0.9rem", fontWeight: 700,
                  background: isActive ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "var(--bg2)",
                  color: isActive ? "#fff" : "var(--text)",
                })}
              >
                {l.icon} {l.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
