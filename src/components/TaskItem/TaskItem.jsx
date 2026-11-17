import { useEffect, useId, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import GripIcon from '../icons/GripIcon.jsx';
import { formatDueDate, isOverdue } from '../../utils/dates.js';
import styles from './TaskItem.module.css';

export default function TaskItem({ task, canReorder, onToggleTask, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDueDate, setDraftDueDate] = useState(task.dueDate ?? '');
  const [draftCategory, setDraftCategory] = useState(task.category ?? '');
  const inputRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditingRef = useRef(false);
  const checkboxId = useId();
  const editId = useId();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isEditing || !canReorder });

  // @dnd-kit calculates movement; CSS Modules control all visual styling.
  const sortableStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX ?? 1}) scaleY(${transform.scaleY ?? 1})`
      : undefined,
    transition,
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (wasEditingRef.current) {
      // Return focus to the Edit button after saving or cancelling.
      editButtonRef.current?.focus();
    }
    wasEditingRef.current = isEditing;
  }, [isEditing]);

  function beginEditing() {
    setDraftTitle(task.title);
    setDraftDueDate(task.dueDate ?? '');
    setDraftCategory(task.category ?? '');
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing(event) {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;

    onUpdateTask(task.id, {
      title,
      dueDate: draftDueDate || null,
      category: draftCategory.trim() || null,
    });
    setIsEditing(false);
  }

  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <li
      ref={setNodeRef}
      style={sortableStyle}
      className={`${styles.item} ${task.completed ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
    >
      {isEditing ? (
        <form className={styles.editForm} onSubmit={saveEditing}>
          <div className={styles.editFields}>
            <label className={styles.visuallyHidden} htmlFor={editId}>Edit task title</label>
            <input
              id={editId}
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
            <div className={styles.editMetadata}>
              <label className={styles.editField}>
                <span>Due date</span>
                <input
                  type="date"
                  value={draftDueDate}
                  onChange={(event) => setDraftDueDate(event.target.value)}
                />
              </label>
              <label className={styles.editField}>
                <span>Category</span>
                <input
                  type="text"
                  value={draftCategory}
                  onChange={(event) => setDraftCategory(event.target.value)}
                  placeholder="Optional category"
                  maxLength={32}
                />
              </label>
            </div>
          </div>
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
            <label className={styles.checkControl} htmlFor={checkboxId}>
              <input
                id={checkboxId}
                className={styles.checkbox}
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                aria-label={`${task.completed ? 'Mark as active' : 'Complete'}: ${task.title}`}
              />
              <span className={styles.checkVisual} aria-hidden="true" />
            </label>
            <div className={styles.taskDetails}>
              <label className={styles.title} htmlFor={checkboxId}>{task.title}</label>
              {(task.category || task.dueDate) && (
                <div className={styles.metadata}>
                  {task.category && <span className={styles.category}>{task.category}</span>}
                  {task.dueDate && (
                    <time
                      className={`${styles.date} ${overdue ? styles.overdue : ''}`}
                      dateTime={task.dueDate}
                    >
                      {overdue ? 'Overdue · ' : 'Due '}{formatDueDate(task.dueDate)}
                    </time>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              ref={editButtonRef}
              className={styles.actionButton}
              type="button"
              onClick={beginEditing}
              aria-label={`Edit: ${task.title}`}
            >
              Edit
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              type="button"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`Delete: ${task.title}`}
            >
              Delete
            </button>
          </div>
          {canReorder && (
            <button
              ref={setActivatorNodeRef}
              className={styles.dragHandle}
              type="button"
              title="Drag to reorder"
              {...attributes}
              {...listeners}
              aria-label={`Reorder: ${task.title}`}
            >
              <GripIcon />
            </button>
          )}
        </>
      )}
    </li>
  );
}
