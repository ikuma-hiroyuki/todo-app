const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const STORAGE_KEY = 'todos';

function loadTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveTodos() {
  const todos = Array.from(list.querySelectorAll('li')).map(li => ({
    text: li.querySelector('span').textContent,
    completed: li.classList.contains('completed'),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodoItem(text, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = text;
  span.addEventListener('click', function () {
    li.classList.toggle('completed');
    saveTodos();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', function () {
    list.removeChild(li);
    saveTodos();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  list.appendChild(li);
}

loadTodos().forEach(({ text, completed }) => addTodoItem(text, completed));

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addTodoItem(text);
  saveTodos();

  input.value = '';
  input.focus();
});
