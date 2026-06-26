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
    memo: li.querySelector('.memo-area').value || '',
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodoItem(text, completed = false, dueDate = '', memo = '') {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const mainRow = document.createElement('div');
  mainRow.className = 'main-row';

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;
  span.addEventListener('click', function () {
    li.classList.toggle('completed');
    saveTodos();
  });

  mainRow.appendChild(span);

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
  mainRow.appendChild(dateInput);

  const memoBtn = document.createElement('button');
  memoBtn.textContent = 'メモ';
  memoBtn.className = 'memo-btn';

  const memoArea = document.createElement('textarea');
  memoArea.className = 'memo-area';
  memoArea.placeholder = 'メモを入力...';
  memoArea.value = memo;
  if (memo) li.classList.add('has-memo');

  memoBtn.addEventListener('click', function () {
    li.classList.toggle('memo-open');
    if (li.classList.contains('memo-open')) memoArea.focus();
  });

  memoArea.addEventListener('input', function () {
    li.classList.toggle('has-memo', !!memoArea.value);
    saveTodos();
  });

  mainRow.appendChild(memoBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', function () {
    list.removeChild(li);
    saveTodos();
  });

  mainRow.appendChild(deleteBtn);

  li.appendChild(mainRow);
  li.appendChild(memoArea);
  list.appendChild(li);
}

loadTodos().forEach(({ text, completed, dueDate, memo }) => addTodoItem(text, completed, dueDate, memo));

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addTodoItem(text, false, dueDateInput.value);
  saveTodos();

  input.value = '';
  dueDateInput.value = '';
  input.focus();
});
