import { useId, useState } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const inputId = useId();

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask(trimmedTitle);
    setTitle('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={inputId}>
        Add something to your day
      </label>

      <div className={styles.controls}>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What would you like to do?"
          maxLength={160}
          autoComplete="off"
          required
        />
        <button className={styles.addButton} type="submit" disabled={!title.trim()}>
          <span aria-hidden="true">+</span> Add task
        </button>
      </div>
    </form>
  );
}
