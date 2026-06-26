import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../components/TodoItem'

const makeTodo = (overrides = {}) => ({
  id: 1,
  text: 'テストタスク',
  completed: false,
  dueDate: '',
  memo: '',
  ...overrides,
})

const defaultProps = (overrides = {}) => ({
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  onUpdateDueDate: vi.fn(),
  onUpdateMemo: vi.fn(),
  ...overrides,
})

describe('TodoItem', () => {
  it('タスクのテキストを表示する', () => {
    render(<TodoItem todo={makeTodo()} {...defaultProps()} />)
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('テキストをクリックすると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={makeTodo()} {...defaultProps({ onToggle })} />)

    await userEvent.click(screen.getByText('テストタスク'))

    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const onDelete = vi.fn()
    render(<TodoItem todo={makeTodo()} {...defaultProps({ onDelete })} />)

    await userEvent.click(screen.getByRole('button', { name: '削除' }))

    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('完了済みタスクはテキストに line-through が付く', () => {
    render(<TodoItem todo={makeTodo({ completed: true })} {...defaultProps()} />)

    expect(screen.getByText('テストタスク')).toHaveClass('line-through')
  })

  it('未完了タスクは line-through が付かない', () => {
    render(<TodoItem todo={makeTodo({ completed: false })} {...defaultProps()} />)

    expect(screen.getByText('テストタスク')).not.toHaveClass('line-through')
  })

  it('期日を変更すると onUpdateDueDate が呼ばれる', async () => {
    const onUpdateDueDate = vi.fn()
    render(<TodoItem todo={makeTodo()} {...defaultProps({ onUpdateDueDate })} />)

    await userEvent.type(screen.getByDisplayValue(''), '2026-12-31')

    expect(onUpdateDueDate).toHaveBeenCalledWith(1, '2026-12-31')
  })

  it('過去の期日を持つ未完了タスクは赤文字になる', () => {
    render(
      <TodoItem
        todo={makeTodo({ dueDate: '2000-01-01' })}
        {...defaultProps()}
      />
    )
    const dateInput = screen.getByDisplayValue('2000-01-01')
    expect(dateInput).toHaveClass('text-red-500')
  })

  it('完了済みタスクは期日が過去でも赤文字にならない', () => {
    render(
      <TodoItem
        todo={makeTodo({ completed: true, dueDate: '2000-01-01' })}
        {...defaultProps()}
      />
    )
    const dateInput = screen.getByDisplayValue('2000-01-01')
    expect(dateInput).not.toHaveClass('text-red-500')
  })

  it('メモボタンをクリックするとメモ入力欄が表示される', async () => {
    render(<TodoItem todo={makeTodo()} {...defaultProps()} />)

    expect(screen.queryByRole('textbox', { name: 'メモ' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'メモ' }))
    expect(screen.getByRole('textbox', { name: 'メモ' })).toBeInTheDocument()
  })

  it('メモ入力欄を編集すると onUpdateMemo が呼ばれる', async () => {
    const onUpdateMemo = vi.fn()
    render(<TodoItem todo={makeTodo()} {...defaultProps({ onUpdateMemo })} />)

    await userEvent.click(screen.getByRole('button', { name: 'メモ' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'メモ' }), { target: { value: 'メモ内容' } })

    expect(onUpdateMemo).toHaveBeenCalledWith(1, 'メモ内容')
  })

  it('メモが設定済みの場合、初期表示でメモ入力欄が展開されている', () => {
    render(<TodoItem todo={makeTodo({ memo: '既存メモ' })} {...defaultProps()} />)

    expect(screen.getByRole('textbox', { name: 'メモ' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('既存メモ')).toBeInTheDocument()
  })
})
