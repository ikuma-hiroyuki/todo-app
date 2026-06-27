import KanbanColumn from './KanbanColumn'
import { SECTIONS } from '../constants'

export default function KanbanBoard({ todos, onToggle, onDelete, onUpdateDueDate, onUpdateMemo, onUpdateSection }) {
  return (
    <div className="flex gap-3">
      {SECTIONS.map(section => (
        <KanbanColumn
          key={section.id}
          section={section}
          todos={todos.filter(t => t.section === section.id)}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateDueDate={onUpdateDueDate}
          onUpdateMemo={onUpdateMemo}
          onUpdateSection={onUpdateSection}
        />
      ))}
    </div>
  )
}
