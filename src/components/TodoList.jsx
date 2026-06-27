import TodoItem from './TodoItem'
import { SECTIONS } from '../constants'

export default function TodoList({ todos, onToggle, onDelete, onUpdateDueDate, onUpdateMemo, onUpdateSection }) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-400 text-sm mt-8">タスクがありません</p>
  }

  function handleDrop(e, sectionId) {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('todoId'))
    if (id) onUpdateSection(id, sectionId)
  }

  return (
    <div data-testid="list-view" className="space-y-4">
      {SECTIONS.map(section => {
        const sectionTodos = todos.filter(t => t.section === section.id)
        return (
          <div
            key={section.id}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, section.id)}
            className="rounded-lg border border-dashed border-gray-200 p-2"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              {section.label}
            </h2>
            {sectionTodos.length > 0 ? (
              <ul className="space-y-2">
                {sectionTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    draggable
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdateDueDate={onUpdateDueDate}
                    onUpdateMemo={onUpdateMemo}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-300 text-center py-2">ここにドロップ</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
