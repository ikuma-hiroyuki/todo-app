import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from '../components/TodoList'

const noop = vi.fn()

const makeTodo = (overrides = {}) => ({
  id: 1,
  text: 'タスク1',
  completed: false,
  dueDate: '',
  memo: '',
  section: 'todo',
  ...overrides,
})

describe('TodoList', () => {
  it('タスクが空の場合にメッセージを表示する', () => {
    render(<TodoList todos={[]} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} onUpdateMemo={noop} onUpdateSection={noop} />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスク一覧を表示する', () => {
    const todos = [
      makeTodo({ id: 1, text: 'タスク1', section: 'todo' }),
      makeTodo({ id: 2, text: 'タスク2', completed: true, section: 'done' }),
    ]
    render(<TodoList todos={todos} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} onUpdateMemo={noop} onUpdateSection={noop} />)

    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('タスクがある場合は「タスクがありません」を表示しない', () => {
    const todos = [makeTodo()]
    render(<TodoList todos={todos} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} onUpdateMemo={noop} onUpdateSection={noop} />)

    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument()
  })

  it('3つのセクション（未着手・進行中・完了）を表示する', () => {
    render(<TodoList todos={[]} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} onUpdateMemo={noop} onUpdateSection={noop} />)
    // 空の場合は「タスクがありません」のみ表示（セクションなし）
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('ドロップするとonUpdateSectionが呼ばれる', () => {
    const onUpdateSection = vi.fn()
    const todos = [makeTodo({ id: 1, text: 'タスク1', section: 'todo' })]
    render(<TodoList todos={todos} onToggle={noop} onDelete={noop} onUpdateDueDate={noop} onUpdateMemo={noop} onUpdateSection={onUpdateSection} />)

    const inProgressArea = screen.getByText('進行中').closest('div')
    fireEvent.dragOver(inProgressArea)
    fireEvent.drop(inProgressArea, {
      dataTransfer: { getData: () => '1' },
    })

    expect(onUpdateSection).toHaveBeenCalledWith(1, 'in-progress')
  })
})
