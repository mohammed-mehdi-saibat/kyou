import { useState } from 'react';
import EnsoIcon from './components/icons/EnsoIcon.jsx';
import FilterBar from './components/FilterBar/FilterBar.jsx';
import TaskCounter from './components/TaskCounter/TaskCounter.jsx';
import TaskForm from './components/TaskForm/TaskForm.jsx';
import TaskList from './components/TaskList/TaskList.jsx';
import ThemeToggle from './components/ThemeToggle/ThemeToggle.jsx';
import { useTasks } from './hooks/useTasks.js';
import styles from './App.module.css';

export default function App() {
  const { tasks, activeCount, addTask, updateTask, deleteTask, toggleTask, reorderTasks } = useTasks();
  const [filter, setFilter] = useState('all');

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.eyebrow}>A quieter way to organize</p>
          <ThemeToggle />
        </div>
        <div className={styles.brand}>
          <h1 className={styles.heading}>
            <span className={styles.japaneseTitle} lang="ja">今日</span>
            <span className={styles.englishTitle}>Today</span>
          </h1>
          <p className={styles.subtitle}>A little room for what matters.</p>
        </div>
        <div className={styles.motif} aria-hidden="true">
          <EnsoIcon />
        </div>
      </header>

      <main className={styles.content}>
        <TaskForm onAddTask={addTask} />
        <div className={styles.listSection}>
          <div className={styles.toolbar}>
            <FilterBar value={filter} onChange={setFilter} />
            <TaskCounter remaining={activeCount} />
          </div>
          <TaskList
            tasks={visibleTasks}
            filter={filter}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onReorderTasks={reorderTasks}
          />
        </div>
      </main>

      <footer className={styles.footer}>Built for quieter days.</footer>
    </div>
  );
}
