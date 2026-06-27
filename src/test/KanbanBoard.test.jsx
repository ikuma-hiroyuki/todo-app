import { render, screen, fireEvent } from '@testing-library/react'
import KanbanBoard from '../components/KanbanBoard'

const noop = vi.fn()

const makeTodo = (overrides = {}) => ({
  id: 1,
  text: 'テストタスク',
  completed: false,
  dueDate: '',
  memo: '',
  section: 'todo',
  ...overrides,
})

const defaultProps = (overrides = {}) => ({
  todos: [],
  onToggle: noop,
  onDelete: noop,
  onUpdateDueDate: noop,
  onUpdateMemo: noop,
  onUpdateSection: noop,
  ...overrides,
})

describe('KanbanBoard', () => {
  it('3つのカラム（未着手・進行中・完了）を表示する', () => {
    render(<KanbanBoard {...defaultProps()} />)

    expect(screen.getByText('未着手')).toBeInTheDocument()
    expect(screen.getByText('進行中')).toBeInTheDocument()
    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('各タスクが対応するカラムに表示される', () => {
    const todos = [
      makeTodo({ id: 1, text: 'タスクA', section: 'todo' }),
      makeTodo({ id: 2, text: 'タスクB', section: 'in-progress' }),
      makeTodo({ id: 3, text: 'タスクC', section: 'done', completed: true }),
    ]
    render(<KanbanBoard {...defaultProps({ todos })} />)

    const todoCol = screen.getByTestId('column-todo')
    const inProgressCol = screen.getByTestId('column-in-progress')
    const doneCol = screen.getByTestId('column-done')

    expect(todoCol).toHaveTextContent('タスクA')
    expect(inProgressCol).toHaveTextContent('タスクB')
    expect(doneCol).toHaveTextContent('タスクC')
  })

  it('ドロップするとonUpdateSectionが呼ばれる', () => {
    const onUpdateSection = vi.fn()
    const todos = [makeTodo({ id: 1, text: 'タスクA', section: 'todo' })]
    render(<KanbanBoard {...defaultProps({ todos, onUpdateSection })} />)

    const inProgressCol = screen.getByTestId('column-in-progress')
    fireEvent.dragOver(inProgressCol)
    fireEvent.drop(inProgressCol, {
      dataTransfer: { getData: () => '1' },
    })

    expect(onUpdateSection).toHaveBeenCalledWith(1, 'in-progress')
  })
})
