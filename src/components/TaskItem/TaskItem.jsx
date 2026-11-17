import { useEffect, useId, useRef, useState } from 'react';
import styles from './TaskItem.module.css';

export default function TaskItem({ task, onToggleTask, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const inputRef = useRef(null);
  const checkboxId = useId();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function beginEditing() {
    setDraftTitle(task.title);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftTitle(task.title);
    setIsEditing(false);
  }

  function saveEditing(event) {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;

    if (title !== task.title) onUpdateTask(task.id, { title });
    setIsEditing(false);
  }

  return (
    <li className={`${styles.item} ${task.completed ? styles.completed : ''}`}>
      {isEditing ? (
        <form className={styles.editForm} onSubmit={saveEditing}>
          <label className={styles.visuallyHidden} htmlFor={`${checkboxId}-edit`}>
            Edit task title
          </label>
          <input
            id={`${checkboxId}-edit`}
            ref={inputRef}
            className={styles.editInput}
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') cancelEditing();
            }}
            maxLength={160}
            required
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} type="submit" disabled={!draftTitle.trim()}>
              Save
            </button>
            <button className={styles.actionButton} type="button" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.taskMain}>
            <input
              id={checkboxId}
              className={styles.checkbox}
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              aria-label={`${task.completed ? 'Mark as active' : 'Complete'}: ${task.title}`}
            />
            <label className={styles.title} htmlFor={checkboxId}>{task.title}</label>
          </div>
          <div className={styles.actions}>
            <button className={styles.actionButton} type="button" onClick={beginEditing} aria-label={`Edit: ${task.title}`}>
              Edit
            </button>
            <button className={`${styles.actionButton} ${styles.deleteButton}`} type="button" onClick={() => onDeleteTask(task.id)} aria-label={`Delete: ${task.title}`}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
