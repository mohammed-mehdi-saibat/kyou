import TaskItem from '../TaskItem/TaskItem.jsx';
import styles from './TaskList.module.css';

export default function TaskList({ tasks, onToggleTask, onUpdateTask, onDeleteTask }) {
  return (
    <section className={styles.section} aria-labelledby="tasks-heading">
      <div className={styles.headingRow}>
        <h2 className={styles.heading} id="tasks-heading">Your tasks</h2>
        <span className={styles.rule} aria-hidden="true" />
      </div>

      {tasks.length === 0 ? (
        <p className={styles.placeholder}>
          No tasks yet. Add one above to begin.
        </p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
