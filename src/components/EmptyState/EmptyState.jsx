import styles from './EmptyState.module.css';

const CONTENT = {
  all: {
    title: 'A little room to begin.',
    description: 'Add your first task above. One small intention is enough.',
  },
  active: {
    title: 'Nothing pressing.',
    description: 'All your current tasks are complete. Enjoy the breathing room.',
  },
  completed: {
    title: 'Progress, at your pace.',
    description: 'Finished tasks will find their place here.',
  },
};

export default function EmptyState({ filter = 'all' }) {
  const { title, description } = CONTENT[filter] ?? CONTENT.all;

  return (
    <div className={styles.empty} role="status">
      <span className={styles.japaneseAccent} lang="ja">余白</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.line} aria-hidden="true" />
    </div>
  );
}
