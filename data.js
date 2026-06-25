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

function addSection(name) {
  const sections = loadSections();
  const section = { id: generateId(), name };
  sections.push(section);
  saveSections(sections);
  return section;
}

function deleteSection(id) {
  saveSections(loadSections().filter(s => s.id !== id));
  saveTodos(loadTodos().map(t => t.sectionId === id ? { ...t, sectionId: null } : t));
}
