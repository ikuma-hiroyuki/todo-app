let sections = loadSections();
let currentView = 'list';

const UNCATEGORIZED = '__uncategorized__';

const toggleZone = document.getElementById('view-toggle-zone');
const sectionControls = document.getElementById('section-controls');
const kanbanBoard = document.getElementById('kanban-board');
const todoListEl = document.getElementById('todo-list');

function renderViewToggle() {
  toggleZone.innerHTML = '';
  const listBtn = document.createElement('button');
  listBtn.type = 'button';
  listBtn.textContent = 'リスト表示';
  listBtn.className = 'view-toggle-btn' + (currentView === 'list' ? ' active' : '');
  listBtn.addEventListener('click', () => setView('list'));

  const kanbanBtn = document.createElement('button');
  kanbanBtn.type = 'button';
  kanbanBtn.textContent = 'カンバン表示';
  kanbanBtn.className = 'view-toggle-btn' + (currentView === 'kanban' ? ' active' : '');
  kanbanBtn.addEventListener('click', () => setView('kanban'));

  toggleZone.appendChild(listBtn);
  toggleZone.appendChild(kanbanBtn);
}

function renderSectionControls() {
  sectionControls.innerHTML = '';

  const addForm = document.createElement('form');
  addForm.className = 'section-add-form';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'セクション名...';
  nameInput.autocomplete = 'off';

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = 'セクション追加';

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    addSection(name);
    sections = loadSections();
    nameInput.value = '';
    rerenderAll();
  });

  addForm.appendChild(nameInput);
  addForm.appendChild(addBtn);
  sectionControls.appendChild(addForm);

  if (sections.length > 0) {
    const list = document.createElement('ul');
    list.className = 'section-list';
    sections.forEach(section => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = section.name;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.textContent = '削除';
      delBtn.className = 'section-delete-btn';
      delBtn.addEventListener('click', () => {
        deleteSection(section.id);
        sections = loadSections();
        todos = loadTodos();
        refresh();
        rerenderAll();
      });

      li.appendChild(label);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
    sectionControls.appendChild(list);
  }
}

function createKanbanCard(todo) {
  const card = document.createElement('div');
  card.className = 'kanban-card' + (todo.completed ? ' completed' : '');
  card.draggable = true;
  card.dataset.id = todo.id;

  const text = document.createElement('span');
  text.className = 'kanban-card-text';
  text.textContent = todo.text;
  card.appendChild(text);

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', todo.id);
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  return card;
}

function createKanbanColumn(sectionId, title) {
  const column = document.createElement('div');
  column.className = 'kanban-column';
  column.dataset.sectionId = sectionId;

  const header = document.createElement('div');
  header.className = 'kanban-column-header';
  header.textContent = title;
  column.appendChild(header);

  const body = document.createElement('div');
  body.className = 'kanban-column-body';
  column.appendChild(body);

  const targetSectionId = sectionId === UNCATEGORIZED ? null : sectionId;
  todos
    .filter(t => (t.sectionId || null) === targetSectionId)
    .forEach(t => body.appendChild(createKanbanCard(t)));

  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    column.classList.add('drag-over');
  });
  column.addEventListener('dragleave', (e) => {
    if (!column.contains(e.relatedTarget)) column.classList.remove('drag-over');
  });
  column.addEventListener('drop', (e) => {
    e.preventDefault();
    column.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    todos = todos.map(t => t.id === id ? { ...t, sectionId: targetSectionId } : t);
    saveTodos(todos);
    renderKanban();
  });

  return column;
}

function renderKanban() {
  kanbanBoard.innerHTML = '';
  kanbanBoard.appendChild(createKanbanColumn(UNCATEGORIZED, '未分類'));
  sections.forEach(section => {
    kanbanBoard.appendChild(createKanbanColumn(section.id, section.name));
  });
}

function rerenderAll() {
  renderSectionControls();
  if (currentView === 'kanban') renderKanban();
}

function setView(view) {
  currentView = view;
  const isKanban = view === 'kanban';
  kanbanBoard.hidden = !isKanban;
  todoListEl.hidden = isKanban;
  renderViewToggle();
  if (isKanban) renderKanban();
}

document.addEventListener('DOMContentLoaded', () => {
  sections = loadSections();
  renderViewToggle();
  renderSectionControls();

  const originalRefresh = refresh;
  refresh = function () {
    originalRefresh();
    if (currentView === 'kanban') renderKanban();
  };
});
