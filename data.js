const STORAGE_KEY = 'todos';
const SECTIONS_KEY = 'sections';

const DEFAULT_TODO = {
  id: null,
  text: '',
  completed: false,
  dueDate: null,
  memo: '',
  sectionId: null,
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadTodos() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return raw.map(t => ({ ...DEFAULT_TODO, ...t }));
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadSections() {
  return JSON.parse(localStorage.getItem(SECTIONS_KEY) || '[]');
}

function saveSections(sections) {
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}
