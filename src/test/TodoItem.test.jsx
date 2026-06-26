import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../components/TodoItem'

const makeTodo = (overrides = {}) => ({
  id: 1,
  text: 'テストタスク',
  completed: false,
  dueDate: '',
  ...overrides,
})

describe('TodoItem', () => {
  it('タスクのテキストを表示する', () => {
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={vi.fn()} onUpdateDueDate={vi.fn()} />)
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('テキストをクリックすると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={onToggle} onDelete={vi.fn()} onUpdateDueDate={vi.fn()} />)

    await userEvent.click(screen.getByText('テストタスク'))

    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const onDelete = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={onDelete} onUpdateDueDate={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: '削除' }))

    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('完了済みタスクはテキストに line-through が付く', () => {
    render(<TodoItem todo={makeTodo({ completed: true })} onToggle={vi.fn()} onDelete={vi.fn()} onUpdateDueDate={vi.fn()} />)

    expect(screen.getByText('テストタスク')).toHaveClass('line-through')
  })

  it('未完了タスクは line-through が付かない', () => {
    render(<TodoItem todo={makeTodo({ completed: false })} onToggle={vi.fn()} onDelete={vi.fn()} onUpdateDueDate={vi.fn()} />)

    expect(screen.getByText('テストタスク')).not.toHaveClass('line-through')
  })

  it('期日を変更すると onUpdateDueDate が呼ばれる', async () => {
    const onUpdateDueDate = vi.fn()
    render(<TodoItem todo={makeTodo()} onToggle={vi.fn()} onDelete={vi.fn()} onUpdateDueDate={onUpdateDueDate} />)

    await userEvent.type(screen.getByDisplayValue(''), '2026-12-31')

    expect(onUpdateDueDate).toHaveBeenCalledWith(1, '2026-12-31')
  })

  it('過去の期日を持つ未完了タスクは赤文字になる', () => {
    render(
      <TodoItem
        todo={makeTodo({ dueDate: '2000-01-01' })}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdateDueDate={vi.fn()}
      />
    )
    const dateInput = screen.getByDisplayValue('2000-01-01')
    expect(dateInput).toHaveClass('text-red-500')
  })

  it('完了済みタスクは期日が過去でも赤文字にならない', () => {
    render(
      <TodoItem
        todo={makeTodo({ completed: true, dueDate: '2000-01-01' })}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdateDueDate={vi.fn()}
      />
    )
    const dateInput = screen.getByDisplayValue('2000-01-01')
    expect(dateInput).not.toHaveClass('text-red-500')
  })
})
