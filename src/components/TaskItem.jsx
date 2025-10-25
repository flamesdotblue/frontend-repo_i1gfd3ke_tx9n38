import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2, Flag } from 'lucide-react'

const priorityColors = {
  high: 'text-red-600',
  medium: 'text-amber-600',
  low: 'text-emerald-600',
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onEdit(task.id, { title: trimmed })
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className="text-gray-500 hover:text-blue-600"
        title={task.completed ? 'Mark as active' : 'Mark as completed'}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className={`truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs ${priorityColors[task.priority]}`}>
              <Flag className="h-3 w-3" /> {task.priority}
            </span>
          </div>
        )}

        {task.description ? (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
        ) : null}
        {task.due_date ? (
          <p className="mt-1 text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleString()}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-md border border-gray-200 bg-white p-2 text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
