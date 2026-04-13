import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import Navbar       from "./components/Navbar"
import Login        from "./pages/Login"
import Today        from "./pages/Today"
import Weekly       from "./pages/Weekly"
import CalendarPage from "./pages/CalendarPage"
import Categories   from "./pages/Categories"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <Navbar />
      <main style={{ paddingBottom: "4rem" }}>{children}</main>
      {/* Decorative bg */}
      <div style={{ position: "fixed", top: "-100px", right: "-100px", zIndex: -1, width: 350, height: 350, borderRadius: "50%", background: "var(--primary)", opacity: 0.05, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-80px", zIndex: -1, width: 280, height: 280, borderRadius: "50%", background: "var(--primary-light)", opacity: 0.07, pointerEvents: "none" }} />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/"          element={<ProtectedRoute><Layout><Today /></Layout></ProtectedRoute>} />
      <Route path="/weekly"    element={<ProtectedRoute><Layout><Weekly /></Layout></ProtectedRoute>} />
      <Route path="/calendar"  element={<ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
