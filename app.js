const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date-input');
const list = document.getElementById('todo-list');

const STORAGE_KEY = 'todos';

function loadTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveTodos() {
  const todos = Array.from(list.querySelectorAll('li')).map(li => ({
    text: li.querySelector('span.todo-text').textContent,
    completed: li.classList.contains('completed'),
    dueDate: li.dataset.dueDate || '',
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodoItem(text, completed = false, dueDate = '') {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');
  if (dueDate) li.dataset.dueDate = dueDate;

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;
  span.addEventListener('click', function () {
    li.classList.toggle('completed');
    saveTodos();
  });

  li.appendChild(span);

  if (dueDate) {
    const today = new Date().toISOString().slice(0, 10);
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date' + (dueDate < today ? ' overdue' : '');
    dueDateSpan.textContent = dueDate;
    li.appendChild(dueDateSpan);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', function () {
    list.removeChild(li);
    saveTodos();
  });

  li.appendChild(deleteBtn);
  list.appendChild(li);
}

loadTodos().forEach(({ text, completed, dueDate }) => addTodoItem(text, completed, dueDate));

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
