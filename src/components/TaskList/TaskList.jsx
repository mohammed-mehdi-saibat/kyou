import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EmptyState from '../EmptyState/EmptyState.jsx';
import TaskItem from '../TaskItem/TaskItem.jsx';
import styles from './TaskList.module.css';

export default function TaskList({
  tasks,
  filter = 'all',
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    // Only reorder the visible tasks; hidden tasks keep their positions.
    onReorderTasks(active.id, over.id, tasks.map((task) => task.id));
  }

  return (
    <section className={styles.section} aria-labelledby="tasks-heading">
      <div className={styles.headingRow}>
        <h2 className={styles.heading} id="tasks-heading">Your tasks</h2>
        <span className={styles.rule} aria-hidden="true" />
      </div>

      {/* Announces filter changes without creating a second visible counter. */}
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in the {filter} view.
      </p>

      {tasks.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <>
          {tasks.length > 1 && (
            <p className={styles.instructions}>
              Drag a handle to reorder. Keyboard: focus a handle, press Space,
              use the arrow keys, then press Space to drop or Escape to cancel.
            </p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className={styles.list}>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    canReorder={tasks.length > 1}
                    onToggleTask={onToggleTask}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}
    </section>
  );
}
