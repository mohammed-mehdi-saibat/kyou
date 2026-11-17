import styles from './FilterBar.module.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterBar({ value, onChange }) {
  return (
    <div className={styles.filters} role="group" aria-label="Filter tasks by status">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`${styles.button} ${value === filter.value ? styles.selected : ''}`}
          aria-pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
