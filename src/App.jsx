import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

const STORAGE_KEY = 'todos'

function loadTodos() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  // 旧フォーマット（id なし）からの移行
  return raw.map((t, i) => ({
    id: t.id ?? Date.now() + i,
    text: t.text,
    completed: t.completed ?? false,
    dueDate: t.dueDate || '',
  }))
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(text, dueDate) {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, dueDate }])
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function updateDueDate(id, dueDate) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, dueDate } : t))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">TODO</h1>
        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdateDueDate={updateDueDate}
        />
      </div>
    </div>
  )
}
