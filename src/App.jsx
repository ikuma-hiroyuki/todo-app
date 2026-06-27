import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import KanbanBoard from './components/KanbanBoard'

const STORAGE_KEY = 'todos'

function loadTodos() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  return raw.map((t, i) => ({
    id: t.id ?? Date.now() + i,
    text: t.text,
    completed: t.completed ?? false,
    dueDate: t.dueDate || '',
    memo: t.memo || '',
    section: t.section ?? (t.completed ? 'done' : 'todo'),
  }))
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [viewMode, setViewMode] = useState('list')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(text, dueDate) {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, dueDate, memo: '', section: 'todo' }])
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t
      const newCompleted = !t.completed
      return { ...t, completed: newCompleted, section: newCompleted ? 'done' : 'todo' }
    }))
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function updateDueDate(id, dueDate) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, dueDate } : t))
  }

  function updateMemo(id, memo) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, memo } : t))
  }

  function updateSection(id, section) {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, section, completed: section === 'done' } : t
    ))
  }

  const commonProps = {
    todos,
    onToggle: toggleTodo,
    onDelete: deleteTodo,
    onUpdateDueDate: updateDueDate,
    onUpdateMemo: updateMemo,
    onUpdateSection: updateSection,
  }

  return (
    <div className={`min-h-screen bg-gray-100 py-10 px-4 ${viewMode === 'kanban' ? 'max-w-full' : ''}`}>
      <div className={viewMode === 'kanban' ? 'max-w-4xl mx-auto' : 'max-w-lg mx-auto'}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">TODO</h1>
          <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              リスト
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              カンバン
            </button>
          </div>
        </div>
        <TodoForm onAdd={addTodo} />
        {viewMode === 'list' ? (
          <TodoList {...commonProps} />
        ) : (
          <KanbanBoard {...commonProps} />
        )}
      </div>
    </div>
  )
}
