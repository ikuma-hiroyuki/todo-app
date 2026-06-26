const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date-input');
const list = document.getElementById('todo-list');

const STORAGE_KEY = 'todos';

function updateOverdue(dateInput) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  dateInput.classList.toggle('overdue', !!dateInput.value && dateInput.value <= today);
}

function loadTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveTodos() {
  const todos = Array.from(list.querySelectorAll('li')).map(li => ({
    text: li.querySelector('span.todo-text').textContent,
    completed: li.classList.contains('completed'),
    dueDate: li.querySelector('.due-date-input').value || '',
    memo: li.querySelector('.memo-textarea').value || '',
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodoItem(text, completed = false, dueDate = '', memo = '') {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const row = document.createElement('div');
  row.className = 'todo-row';

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;
  span.addEventListener('click', function () {
    li.classList.toggle('completed');
    saveTodos();
  });
  row.appendChild(span);

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'due-date-input';
  if (dueDate) {
    dateInput.value = dueDate;
    updateOverdue(dateInput);
  }
  dateInput.addEventListener('change', function () {
    updateOverdue(dateInput);
    saveTodos();
  });
  row.appendChild(dateInput);

  const memoToggle = document.createElement('button');
  memoToggle.textContent = 'メモ';
  memoToggle.className = 'memo-btn';
  memoToggle.type = 'button';
  row.appendChild(memoToggle);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', function () {
    list.removeChild(li);
    saveTodos();
  });
  row.appendChild(deleteBtn);

  li.appendChild(row);

  const memoArea = document.createElement('div');
  memoArea.className = 'memo-area';
  if (!memo) memoArea.hidden = true;

  const memoTextarea = document.createElement('textarea');
  memoTextarea.className = 'memo-textarea';
  memoTextarea.placeholder = 'メモを入力...';
  memoTextarea.value = memo;
  memoTextarea.addEventListener('input', saveTodos);
  memoArea.appendChild(memoTextarea);

  memoToggle.addEventListener('click', function () {
    memoArea.hidden = !memoArea.hidden;
    if (!memoArea.hidden) memoTextarea.focus();
  });

  li.appendChild(memoArea);
  list.appendChild(li);
}

loadTodos().forEach(({ text, completed, dueDate, memo }) => addTodoItem(text, completed, dueDate, memo));

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addTodoItem(text, false, dueDateInput.value, '');
  saveTodos();

  input.value = '';
  dueDateInput.value = '';
  input.focus();
});
