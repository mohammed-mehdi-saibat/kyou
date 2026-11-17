import { isValidDateOnly } from './dates.js';
import { generateId } from './generateId.js';

export function normalizeCategory(value) {
  return typeof value === 'string' ? value.trim() || null : null;
}

export function normalizeDueDate(value) {
  return isValidDateOnly(value) ? value : null;
}

// All tasks use one consistent shape, including optional fields.
export function createTask({ title, dueDate = null, category = null }) {
  const cleanTitle = typeof title === 'string' ? title.trim() : '';
  if (!cleanTitle) throw new Error('A task needs a title.');

  const now = new Date().toISOString();

  return {
    id: generateId(),
    title: cleanTitle,
    completed: false,
    dueDate: normalizeDueDate(dueDate),
    category: normalizeCategory(category),
    createdAt: now,
    updatedAt: now,
  };
}

// Ignore invalid persisted entries and duplicate IDs without crashing the app.
export function normalizeTasks(value) {
  if (!Array.isArray(value)) return [];

  const seenIds = new Set();

  return value.flatMap((candidate) => {
    if (
      !candidate ||
      typeof candidate !== 'object' ||
      typeof candidate.id !== 'string' ||
      !candidate.id.trim() ||
      seenIds.has(candidate.id) ||
      typeof candidate.title !== 'string' ||
      !candidate.title.trim()
    ) {
      return [];
    }

    seenIds.add(candidate.id);
    const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : '';

    return [{
      id: candidate.id,
      title: candidate.title.trim(),
      completed: candidate.completed === true,
      dueDate: normalizeDueDate(candidate.dueDate),
      category: normalizeCategory(candidate.category),
      createdAt,
      updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : createdAt,
    }];
  });
}
