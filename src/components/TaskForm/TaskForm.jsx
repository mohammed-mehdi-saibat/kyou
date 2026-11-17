import { useId, useState } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const titleId = useId();
  const dueDateId = useId();
  const categoryId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddTask(cleanTitle, {
      dueDate: dueDate || null,
      category: category.trim() || null,
    });
    setTitle('');
    setDueDate('');
    setCategory('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={titleId}>
        Add something to your day
      </label>

      <div className={styles.controls}>
        <input
          id={titleId}
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

      <div className={styles.optionalFields}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={dueDateId}>Due date (optional)</label>
          <input
            id={dueDateId}
            className={styles.fieldInput}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={categoryId}>Category (optional)</label>
          <input
            id={categoryId}
            className={styles.fieldInput}
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Personal, Work"
            maxLength={32}
            autoComplete="off"
          />
        </div>
      </div>
    </form>
  );
}
