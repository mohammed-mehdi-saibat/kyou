import styles from './TaskCounter.module.css';

export default function TaskCounter({ remaining }) {
  return (
    <p className={styles.counter} role="status" aria-live="polite" aria-atomic="true">
      <strong className={styles.number}>{remaining}</strong>{' '}
      {remaining === 1 ? 'task' : 'tasks'} remaining
    </p>
  );
}
