import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { taskReducer, TASK_ACTIONS } from '../reducers/taskReducer.js';
import { STORAGE_KEYS } from '../services/storage.js';
import { createTask, normalizeTasks } from '../utils/task.js';

export const TaskContext = createContext(null);

const EMPTY_TASKS = [];

export function TaskProvider({ children }) {
  const { read, write } = useLocalStorage(STORAGE_KEYS.TASKS, EMPTY_TASKS, normalizeTasks);
  const [tasks, dispatch] = useReducer(taskReducer, undefined, read);

  // Reducer state is the source of truth; persist whenever it changes.
  useEffect(() => {
    write(tasks);
  }, [tasks, write]);

  const addTask = useCallback((title, options = {}) => {
    const task = createTask({ title, ...options });
    dispatch({ type: TASK_ACTIONS.ADD, payload: task });
    return task.id;
  }, []);

  const updateTask = useCallback((id, updates) => {
    dispatch({
      type: TASK_ACTIONS.UPDATE,
      payload: { id, updates, updatedAt: new Date().toISOString() },
    });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.DELETE, payload: { id } });
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({
      type: TASK_ACTIONS.TOGGLE,
      payload: { id, updatedAt: new Date().toISOString() },
    });
  }, []);

  const reorderTasks = useCallback((activeId, overId, visibleIds) => {
    dispatch({ type: TASK_ACTIONS.REORDER, payload: { activeId, overId, visibleIds } });
  }, []);

  const activeCount = tasks.filter((task) => !task.completed).length;

  const value = useMemo(() => ({
    tasks,
    activeCount,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
  }), [tasks, activeCount, addTask, updateTask, deleteTask, toggleTask, reorderTasks]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
