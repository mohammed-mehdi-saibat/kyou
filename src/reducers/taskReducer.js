import { normalizeCategory, normalizeDueDate } from '../utils/task.js';

export const TASK_ACTIONS = Object.freeze({
  ADD: 'ADD_TASK',
  UPDATE: 'UPDATE_TASK',
  DELETE: 'DELETE_TASK',
  TOGGLE: 'TOGGLE_TASK',
  REORDER: 'REORDER_TASKS',
});

export function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD: {
      const task = action.payload;
      if (
        !task ||
        typeof task.id !== 'string' ||
        typeof task.title !== 'string' ||
        !task.title.trim() ||
        state.some((item) => item.id === task.id)
      ) return state;

      return [...state, task];
    }

    case TASK_ACTIONS.UPDATE: {
      const { id, updates, updatedAt } = action.payload ?? {};
      if (!updates || typeof updates !== 'object') return state;

      return state.map((task) => {
        if (task.id !== id) return task;

        let { title, dueDate, category } = task;
        if (Object.hasOwn(updates, 'title') && typeof updates.title === 'string' && updates.title.trim()) {
          title = updates.title.trim();
        }
        if (Object.hasOwn(updates, 'dueDate')) {
          dueDate = normalizeDueDate(updates.dueDate);
        }
        if (Object.hasOwn(updates, 'category')) {
          category = normalizeCategory(updates.category);
        }

        if (title === task.title && dueDate === task.dueDate && category === task.category) {
          return task;
        }

        return { ...task, title, dueDate, category, updatedAt: updatedAt ?? task.updatedAt };
      });
    }

    case TASK_ACTIONS.DELETE:
      return state.filter((task) => task.id !== action.payload?.id);

    case TASK_ACTIONS.TOGGLE:
      return state.map((task) => (
        task.id === action.payload?.id
          ? { ...task, completed: !task.completed, updatedAt: action.payload.updatedAt ?? task.updatedAt }
          : task
      ));

    case TASK_ACTIONS.REORDER: {
      const { activeId, overId } = action.payload ?? {};
      const from = state.findIndex((task) => task.id === activeId);
      const to = state.findIndex((task) => task.id === overId);
      if (from === -1 || to === -1 || from === to) return state;

      const reordered = [...state];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      return reordered;
    }

    default:
      return state;
  }
}
