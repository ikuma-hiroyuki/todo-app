import { useState } from 'react'

function isOverdue(dueDate) {
  if (!dueDate) return false
  const today = new Date()
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return dueDate <= ymd
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdateDueDate, onUpdateMemo }) {
  const overdue = !todo.completed && isOverdue(todo.dueDate)
  const [memoOpen, setMemoOpen] = useState(!!todo.memo)

  return (
    <li className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          onClick={() => onToggle(todo.id)}
          className={`flex-1 cursor-pointer text-sm select-none ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
        <input
          type="date"
          value={todo.dueDate}
          onChange={e => onUpdateDueDate(todo.id, e.target.value)}
          className={`text-xs px-2 py-1 rounded-md border focus:outline-none focus:border-blue-400 bg-transparent ${
            overdue
              ? 'text-red-500 font-bold border-red-200'
              : 'text-gray-400 border-transparent hover:border-gray-200'
          }`}
        />
        <button
          onClick={() => setMemoOpen(o => !o)}
          className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          メモ
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors flex-shrink-0"
        >
          削除
        </button>
      </div>
      {memoOpen && (
        <textarea
          aria-label="メモ"
          value={todo.memo}
          onChange={e => onUpdateMemo(todo.id, e.target.value)}
          rows={2}
          placeholder="メモを入力..."
          className="mt-2 w-full text-xs px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 resize-none text-gray-600"
        />
      )}
    </li>
  )
}
