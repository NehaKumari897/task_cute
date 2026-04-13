import { useState, useEffect } from "react"
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase/config"

export function useTasks(uid) {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const q = query(collection(db, "tasks"), where("uid", "==", uid))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid])

  const addTask = (data) =>
    addDoc(collection(db, "tasks"), {
      ...data, uid,
      done: false,
      createdAt: serverTimestamp(),
    })

  const updateTask = (id, data) => updateDoc(doc(db, "tasks", id), data)
  const deleteTask = (id)       => deleteDoc(doc(db, "tasks", id))
  const toggleDone = (task)     => updateTask(task.id, { done: !task.done })

  return { tasks, loading, addTask, updateTask, deleteTask, toggleDone }
}
