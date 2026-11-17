import TaskForm from './components/TaskForm/TaskForm.jsx';
import TaskList from './components/TaskList/TaskList.jsx';
import { useTasks } from './hooks/useTasks.js';
import styles from './App.module.css';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>A quieter way to organize</p>
        <h1 className={styles.heading}>
          <span className={styles.japaneseTitle} lang="ja">今日</span>
          <span className={styles.englishTitle}>Today</span>
        </h1>
        <p className={styles.subtitle}>A little room for what matters.</p>
      </header>

      <main className={styles.content}>
        <TaskForm onAddTask={addTask} />
        <div className={styles.listSection}>
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>

      <footer className={styles.footer}>Built for quieter days.</footer>
    </div>
  );
}
