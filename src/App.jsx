import { useEffect, useMemo, useState } from 'react'
import TaskInput from './components/TaskInput'
import FiltersBar from './components/FiltersBar'
import TaskList from './components/TaskList'
import StatsBar from './components/StatsBar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  return res.json()
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ status: 'all', priority: '', search: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async (f = filters) => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (f.status && f.status !== 'all') params.set('status', f.status)
      if (f.search) params.set('search', f.search)
      if (f.priority) params.set('priority', f.priority)
      const data = await api(`/api/tasks?${params.toString()}`)
      setTasks(data)
    } catch (e) {
      setError('Could not load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    fetchTasks(filters)
  }, [filters])

  const handleAdd = async ({ title, priority }) => {
    try {
      const newTask = await api('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, priority }),
      })
      setTasks((prev) => [newTask, ...prev])
    } catch (e) {
      setError('Failed to add task')
    }
  }

  const handleToggle = async (id, completed) => {
    try {
      const updated = await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      })
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError('Failed to update task')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError('Failed to delete task')
    }
  }

  const handleEdit = async (id, changes) => {
    try {
      const updated = await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      })
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError('Failed to edit task')
    }
  }

  const handleClearCompleted = async () => {
    try {
      await api('/api/tasks/clear-completed', { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => !t.completed))
    } catch (e) {
      setError('Failed to clear completed')
    }
  }

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Tasks</h1>
          <p className="text-gray-600">Stay organized with priorities, filters, and progress tracking.</p>
        </header>

        <div className="mb-4">
          <TaskInput onAdd={handleAdd} />
        </div>

        <div className="mb-4">
          <FiltersBar onFilterChange={setFilters} onClearCompleted={handleClearCompleted} />
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">Loading...</div>
        ) : (
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
        )}

        <div className="mt-4">
          <StatsBar total={tasks.length} completed={completedCount} />
        </div>
      </div>
    </div>
  )
}
