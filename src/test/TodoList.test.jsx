import { render, screen } from '@testing-library/react'
import TodoList from '../components/TodoList'

const noop = vi.fn()

describe('TodoList', () => {
  it('タスクが空の場合にメッセージを表示する', () => {
    render(<TodoList todos={[]} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスク一覧を表示する', () => {
    const todos = [
      { id: 1, text: 'タスク1', completed: false, dueDate: '' },
      { id: 2, text: 'タスク2', completed: true, dueDate: '2026-12-31' },
    ]
    render(<TodoList todos={todos} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('タスクがある場合は「タスクがありません」を表示しない', () => {
    const todos = [{ id: 1, text: 'タスク1', completed: false, dueDate: '' }]
    render(<TodoList todos={todos} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} />)

    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument()
  })
})
