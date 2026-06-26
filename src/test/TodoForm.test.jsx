import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from '../components/TodoForm'

describe('TodoForm', () => {
  it('テキストと期日を入力して追加できる', async () => {
    const onAdd = vi.fn()
    render(<TodoForm onAdd={onAdd} />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '買い物')
    await userEvent.type(screen.getByLabelText('期日'), '2026-12-31')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('買い物', '2026-12-31')
  })

  it('送信後に入力欄がリセットされる', async () => {
    render(<TodoForm onAdd={vi.fn()} />)
    const textInput = screen.getByPlaceholderText('タスクを入力...')

    await userEvent.type(textInput, 'タスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(textInput).toHaveValue('')
  })

  it('空文字では onAdd を呼ばない', async () => {
    const onAdd = vi.fn()
    render(<TodoForm onAdd={onAdd} />)

    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('スペースのみでは onAdd を呼ばない', async () => {
    const onAdd = vi.fn()
    render(<TodoForm onAdd={onAdd} />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '   ')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('テキストをトリムして渡す', async () => {
    const onAdd = vi.fn()
    render(<TodoForm onAdd={onAdd} />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '  タスク  ')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('タスク', '')
  })
})
