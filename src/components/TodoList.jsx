import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggle, onDelete, onUpdateDueDate, onUpdateMemo }) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-400 text-sm mt-8">タスクがありません</p>
  }
  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateDueDate={onUpdateDueDate}
          onUpdateMemo={onUpdateMemo}
        />
      ))}
    </ul>
  )
}
