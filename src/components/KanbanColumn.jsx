import TodoItem from './TodoItem'

export default function KanbanColumn({ section, todos, onToggle, onDelete, onUpdateDueDate, onUpdateMemo, onUpdateSection }) {
  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('todoId'))
    if (id) onUpdateSection(id, section.id)
  }

  return (
    <div
      data-testid={`column-${section.id}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 min-w-0 bg-gray-50 rounded-lg p-3"
    >
      <h2 className="text-sm font-semibold text-gray-600 mb-3 text-center">{section.label}</h2>
      <ul className="space-y-2 min-h-16">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            draggable
            kanban
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateDueDate={onUpdateDueDate}
            onUpdateMemo={onUpdateMemo}
          />
        ))}
      </ul>
    </div>
  )
}
