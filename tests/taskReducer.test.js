import test from 'node:test';
import assert from 'node:assert/strict';
import { taskReducer, TASK_ACTIONS } from '../src/reducers/taskReducer.js';
import { createTask, normalizeTasks } from '../src/utils/task.js';
import { isOverdue, isValidDateOnly, todayDateOnly } from '../src/utils/dates.js';
import { storage } from '../src/services/storage.js';

const make = (title) => createTask({ title });

test('creates trimmed tasks with expected fields', () => {
  const task = createTask({ title: '  Study React  ', category: ' Learning ' });
  assert.equal(task.title, 'Study React');
  assert.equal(task.category, 'Learning');
  assert.equal(task.completed, false);
  assert.equal(task.dueDate, null);
  assert.ok(task.id);
});

test('adds a task without mutating the previous state', () => {
  const task = make('Read');
  const original = [];
  const result = taskReducer(original, { type: TASK_ACTIONS.ADD, payload: task });
  assert.equal(original.length, 0);
  assert.deepEqual(result, [task]);
});

test('updates only editable properties and preserves the task identity', () => {
  const task = make('Old title');
  const result = taskReducer([task], {
    type: TASK_ACTIONS.UPDATE,
    payload: {
      id: task.id,
      updates: { title: ' New title ', category: ' Personal ', id: 'not-allowed' },
      updatedAt: '2026-11-17T09:00:00.000Z',
    },
  });
  assert.equal(result[0].title, 'New title');
  assert.equal(result[0].category, 'Personal');
  assert.equal(result[0].id, task.id);
});

test('toggles completion and deletes tasks', () => {
  const task = make('Exercise');
  const toggled = taskReducer([task], {
    type: TASK_ACTIONS.TOGGLE,
    payload: { id: task.id, updatedAt: '2026-11-17T09:00:00.000Z' },
  });
  assert.equal(toggled[0].completed, true);
  assert.equal(task.completed, false);
  const removed = taskReducer(toggled, { type: TASK_ACTIONS.DELETE, payload: { id: task.id } });
  assert.deepEqual(removed, []);
});

test('reorders items without changing their data', () => {
  const a = make('A');
  const b = make('B');
  const c = make('C');
  const result = taskReducer([a, b, c], {
    type: TASK_ACTIONS.REORDER,
    payload: { activeId: a.id, overId: c.id },
  });
  assert.deepEqual(result.map((task) => task.title), ['B', 'C', 'A']);
});

test('normalizes storage data safely, removing invalid/duplicate tasks', () => {
  const task = make('Save');
  const result = normalizeTasks([task, task, null, { id: 'bad', title: '' }]);
  assert.deepEqual(result, [task]);
  assert.deepEqual(normalizeTasks('not an array'), []);
});

test('handles local date-only values without UTC conversion', () => {
  assert.equal(isValidDateOnly('2026-02-29'), false);
  assert.equal(isValidDateOnly('2028-02-29'), true);
  assert.equal(todayDateOnly(new Date(2026, 10, 17)), '2026-11-17');
  assert.equal(isOverdue('2026-11-16', '2026-11-17'), true);
  assert.equal(isOverdue('2026-11-17', '2026-11-17'), false);
});


test('storage service safely reads, writes, and removes browser values', () => {
  const previousWindow = globalThis.window;
  const values = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  };

  try {
    assert.equal(storage.setItem('test-key', '[1,2]'), true);
    assert.equal(storage.getItem('test-key'), '[1,2]');
    assert.equal(storage.removeItem('test-key'), true);
    assert.equal(storage.getItem('test-key'), null);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});


test('reorders visible active tasks without moving hidden completed tasks', () => {
  const a = make('Active A');
  const done = { ...make('Completed'), completed: true };
  const b = make('Active B');
  const c = make('Active C');
  const original = [a, done, b, c];

  const result = taskReducer(original, {
    type: TASK_ACTIONS.REORDER,
    payload: { activeId: c.id, overId: a.id, visibleIds: [a.id, b.id, c.id] },
  });

  assert.deepEqual(result.map((task) => task.title), [
    'Active C', 'Completed', 'Active A', 'Active B',
  ]);
  assert.equal(result[1], done);
  assert.equal(original[0], a);
});

test('reorders completed tasks while leaving active tasks in place', () => {
  const a = make('Active A');
  const x = { ...make('Done X'), completed: true };
  const b = make('Active B');
  const y = { ...make('Done Y'), completed: true };

  const result = taskReducer([a, x, b, y], {
    type: TASK_ACTIONS.REORDER,
    payload: { activeId: y.id, overId: x.id, visibleIds: [x.id, y.id] },
  });

  assert.deepEqual(result.map((task) => task.title), [
    'Active A', 'Done Y', 'Active B', 'Done X',
  ]);
});

test('ignores stale or invalid visible reorder lists', () => {
  const a = make('A');
  const b = make('B');
  const state = [a, b];

  for (const visibleIds of [[b.id, a.id], [a.id, a.id], [a.id, 'missing']]) {
    const result = taskReducer(state, {
      type: TASK_ACTIONS.REORDER,
      payload: { activeId: a.id, overId: b.id, visibleIds },
    });
    assert.equal(result, state);
  }
});
