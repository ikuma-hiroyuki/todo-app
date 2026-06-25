// ========== Issue #3 専用ゾーン ==========
function createDueDateElement(todo) {
  if (!todo.dueDate) return null;

  const span = document.createElement('span');
  span.className = 'due-date';

  const [y, m, d] = todo.dueDate.split('-');
  span.textContent = `📅 ${y}/${m}/${d}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${todo.dueDate}T00:00:00`);
  if (due < today) span.classList.add('overdue');

  return span;
}
function getFormDueDate() {
  const value = document.getElementById('todo-due').value;
  return value === '' ? null : value;
}

// ========== Issue #4 専用ゾーン ==========
function createMemoElement(todo) {
  return null;
}
function getFormMemo() {
  return '';
}

// ========== 共通（変更しない） ==========
function createTodoItem(todo, onToggle, onDelete) {
  const li = document.createElement('li');
  li.dataset.id = todo.id;
  if (todo.completed) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = todo.text;
  span.addEventListener('click', () => onToggle(todo.id));

  const dueDateEl = createDueDateElement(todo);
  const memoEl = createMemoElement(todo);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => onDelete(todo.id));

  li.appendChild(span);
  if (dueDateEl) li.appendChild(dueDateEl);
  if (memoEl) li.appendChild(memoEl);
  li.appendChild(deleteBtn);

  return li;
}

function renderList(todos, container, onToggle, onDelete) {
  container.innerHTML = '';
  todos.forEach(todo => {
    container.appendChild(createTodoItem(todo, onToggle, onDelete));
  });
}
