import { useTasks } from './hooks/useTasks.js';
import styles from './App.module.css';

export default function App() {
  const { tasks, activeCount } = useTasks();

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
        <section className={styles.card} aria-labelledby="preview-title">
          <p className={styles.cardLabel}>State foundation</p>
          <h2 className={styles.cardTitle} id="preview-title">Your tasks have a home.</h2>
          <p className={styles.cardDescription}>
            {activeCount} active tasks · {tasks.length} total saved
          </p>
          <p className={styles.cardDescription}>
            Task controls and the task list arrive in Step 5.
          </p>
          <hr className={styles.accentRule} aria-hidden="true" />
        </section>
      </main>

      <footer className={styles.footer}>Built for quieter days.</footer>
    </div>
  );
}
