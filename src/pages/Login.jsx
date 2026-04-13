import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { auth } from "../firebase/config"

const floatingItems = [
  { content: "📋 3 tasks due", top: "8%",  left: "3%",  delay: 0,   color: "#ede9fe", border: "#c4b5fd" },
  { content: "✅ Task done!",   top: "18%", right: "2%", delay: 0.5, color: "#dcfce7", border: "#86efac" },
  { content: "🎯 High priority",top: "38%", left: "1%", delay: 0.8, color: "#fee2e2", border: "#fca5a5" },
  { content: "⏰ 2:00 PM",      top: "60%", left: "2%", delay: 1.0, color: "#fef3c7", border: "#fcd34d" },
  { content: "🌸 Self care",    top: "78%", left: "4%", delay: 1.3, color: "#fce7f3", border: "#f9a8d4" },
  { content: "💡 New idea",     top: "12%", right: "1%",delay: 0.3, color: "#fef3c7", border: "#fcd34d" },
  { content: "📅 Weekly plan",  top: "48%", right: "1%",delay: 0.7, color: "#e0f2fe", border: "#7dd3fc" },
  { content: "⭐ 5 completed",  top: "72%", right: "2%",delay: 1.1, color: "#ede9fe", border: "#c4b5fd" },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState("login")
  const [name, setName]     = useState("")
  const [email, setEmail]   = useState("")
  const [pass, setPass]     = useState("")
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) navigate("/") }, [user, navigate])

  const handleEmail = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      if (tab === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, pass)
        await updateProfile(cred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, pass)
      }
      navigate("/")
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/ \(auth.*\)\.?/, ""))
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f0ff 0%, #ede9fe 50%, #e0d9ff 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "1rem", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-120px", right: "-120px", width: 380, height: 380, borderRadius: "50%", background: "rgba(124,58,237,0.12)" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px",  width: 300, height: 300, borderRadius: "50%", background: "rgba(167,139,250,0.15)" }} />
      <div style={{ position: "absolute", top: "40%",    left: "-60px",    width: 200, height: 200, borderRadius: "50%", background: "rgba(196,181,253,0.2)" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "-40px",   width: 160, height: 160, borderRadius: "50%", background: "rgba(124,58,237,0.08)" }} />

    {/* Floating emojis */}
      {floatingItems.map((item, i) => (
  <motion.div key={i}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: item.delay }}
    style={{
      position: "absolute",
      top: item.top, left: item.left, right: item.right,
      background: item.color,
      border: `1px solid ${item.border}`,
      borderRadius: "12px",
      padding: "6px 12px",
      fontSize: "0.75rem",
      fontWeight: 700,
      color: "#374151",
      whiteSpace: "nowrap",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      backdropFilter: "blur(4px)",
    }}
  >
    {item.content}
  </motion.div>
))}

      {/* Header above card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "1.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "2rem" }}>✨</span>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.4rem", color: "#5b21b6" }}>
            TaskCute
          </h1>
          <span style={{ fontSize: "2rem" }}>✨</span>
        </div>
        <p style={{ color: "#7c3aed", fontWeight: 600, fontSize: "0.95rem" }}>
          Your cutest daily task manager 🌸
        </p>

        {/* Feature row */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
          {["📅 Weekly View", "🗓 Calendar", "🔔 Reminders", "✦ Categories", "🎯 Priorities"].map((f) => (
            <span key={f} style={{
              background: "rgba(124,58,237,0.12)",
              color: "#5b21b6",
              borderRadius: "20px", padding: "4px 12px",
              fontSize: "0.78rem", fontWeight: 700,
              border: "1px solid rgba(124,58,237,0.2)",
            }}>{f}</span>
          ))}
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "#fff", borderRadius: "28px",
          padding: "2rem 2rem",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.1)",
        }}
      >
        {/* Tab toggle */}
        <div style={{ display: "flex", background: "#f3f0ff", borderRadius: "14px", padding: "4px", marginBottom: "1.5rem" }}>
          {["login", "signup"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError("") }}
              style={{
                flex: 1, padding: "8px", borderRadius: "10px", border: "none",
                background: tab === t ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "transparent",
                color: tab === t ? "#fff" : "#7c3aed",
                fontFamily: "Nunito", fontWeight: 700, fontSize: "0.88rem",
                cursor: "pointer", transition: "all 0.25s",
              }}
            >
              {t === "login" ? "🔑 Sign In" : "🌸 Sign Up"}
            </button>
          ))}
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
          {tab === "signup" && (
            <input
              className="input"
              placeholder="Your name 🌸"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="input"
            type="email"
            placeholder="Email address 📧"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password 🔒"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.8rem", background: "#fee2e2", padding: "8px 12px", borderRadius: "10px", fontWeight: 600 }}>
              ⚠️ {error}
            </p>
          )}

          <button type="submit" className="btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", marginTop: "4px" }}
            disabled={loading}
          >
            {loading ? "Loading..." : tab === "login" ? "Sign In ✦" : "Create Account ✦"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
          <div style={{ flex: 1, height: 1, background: "#e9d5ff" }} />
          <span style={{ fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e9d5ff" }} />
        </div>

        {/* Google login */}
        <button onClick={login}
          style={{
            width: "100%", padding: "0.85rem",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            background: "#fff", border: "1.5px solid #e9d5ff",
            borderRadius: "50px", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: "0.92rem",
            color: "#5b21b6", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f0ff"; e.currentTarget.style.borderColor = "#a78bfa" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e9d5ff" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ color: "#a78bfa", fontSize: "0.75rem", marginTop: "1.25rem", textAlign: "center" }}>
          Your tasks are private and secure 🔒
        </p>
      </motion.div>
    </div>
  )
}