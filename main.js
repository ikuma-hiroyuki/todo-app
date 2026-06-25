let todos = loadTodos();

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');

function refresh() {
  renderList(todos, listEl, handleToggle, handleDelete);
}

function handleToggle(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTodos(todos);
  refresh();
}

function handleDelete(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  refresh();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const newTodo = { ...DEFAULT_TODO, id: generateId(), text };
  todos.push(newTodo);
  saveTodos(todos);
  refresh();
  input.value = '';
  input.focus();
});

refresh();
