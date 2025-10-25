import { useState, useEffect } from 'react'
import { Filter, Search, Trash2 } from 'lucide-react'

export default function FiltersBar({ onFilterChange, onClearCompleted }) {
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange({ status, priority, search })
    }, 250)
    return () => clearTimeout(timeout)
  }, [status, priority, search])

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-md border border-gray-200 bg-white p-1 shadow-sm">
          {['all', 'active', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                status === s ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Priority: Any</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={onClearCompleted}
          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-red-600 shadow-sm hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear Completed
        </button>
      </div>
    </div>
  )
}
