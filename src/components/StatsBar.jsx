export default function StatsBar({ total, completed }) {
  const remaining = total - completed
  const percent = total ? Math.round((completed / total) * 100) : 0
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-sm">
      <div className="text-gray-700">
        <span className="font-medium">{remaining}</span> remaining ·{' '}
        <span className="font-medium">{completed}</span> completed
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 w-40 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-gray-600">{percent}%</span>
      </div>
    </div>
  )
}
