import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
})

describe('App', () => {
  it('初期状態で「タスクがありません」を表示する', () => {
    render(<App />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクを追加できる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '新しいタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByText('新しいタスク')).toBeInTheDocument()
  })

  it('タスクをトグルできる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'タスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))
    await userEvent.click(screen.getByText('タスク'))

    expect(screen.getByText('タスク')).toHaveClass('line-through')
  })

  it('タスクを削除できる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '削除するタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))
    await userEvent.click(screen.getByRole('button', { name: '削除' }))

    expect(screen.queryByText('削除するタスク')).not.toBeInTheDocument()
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクを localStoraage に保存する', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '保存タスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].text).toBe('保存タスク')
    expect(stored[0].completed).toBe(false)
  })

  it('localStorage からタスクを復元する', () => {
    localStorage.setItem('todos', JSON.stringify([
      { id: 1, text: '既存タスク', completed: false, dueDate: '' },
    ]))

    render(<App />)

    expect(screen.getByText('既存タスク')).toBeInTheDocument()
  })

  it('旧フォーマット（id なし）からの移行を処理する', () => {
    localStorage.setItem('todos', JSON.stringify([
      { text: '旧タスク', completed: false },
    ]))

    render(<App />)

    expect(screen.getByText('旧タスク')).toBeInTheDocument()
  })

  it('期日付きでタスクを追加できる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '期日タスク')
    await userEvent.type(screen.getByLabelText('期日'), '2026-12-31')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].dueDate).toBe('2026-12-31')
  })

  it('タスクの期日を更新できる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '期日変更タスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    // リスト内の date input に絞って取得（フォームの期日入力と区別）
    const todoDateInput = within(screen.getByTestId('list-view')).getByDisplayValue('')
    fireEvent.change(todoDateInput, { target: { value: '2027-06-30' } })

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].dueDate).toBe('2027-06-30')
  })

  it('タスクのメモを更新できる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'メモタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))
    await userEvent.click(screen.getByRole('button', { name: 'メモ' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'メモ' }), '詳細メモ')

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].memo).toBe('詳細メモ')
  })

  it('追加したタスクに memo フィールドが含まれる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'メモなしタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].memo).toBe('')
  })

  it('追加したタスクのsectionが"todo"になる', async () => {
    render(<App />)

    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'セクションタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].section).toBe('todo')
  })

  it('リスト・カンバン切り替えボタンが表示される', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'リスト' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'カンバン' })).toBeInTheDocument()
  })

  it('カンバンボタンをクリックするとカンバンビューに切り替わる', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'カンバン' }))

    expect(screen.getByText('未着手')).toBeInTheDocument()
    expect(screen.getByText('進行中')).toBeInTheDocument()
    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('旧フォーマットのcompleted:trueはsection:"done"に移行される', () => {
    localStorage.setItem('todos', JSON.stringify([
      { id: 1, text: '完了済みタスク', completed: true, dueDate: '' },
    ]))

    render(<App />)

    const stored = JSON.parse(localStorage.getItem('todos'))
    expect(stored[0].section).toBe('done')
  })
})
