import EnsoIcon from '../../icons/EnsoIcon.jsx';
import styles from './FloatingEnsos.module.css';

// Reuse the exact same hand-drawn Enso SVG as the header watermark.
// Negative delays spread the rings across the viewport on first render.
const CIRCLES = [
  { size: '2.9rem', top: '9%', duration: '58s', delay: '-16s', opacity: 0.39 },
  { size: '3.7rem', top: '19%', duration: '69s', delay: '-45s', opacity: 0.32 },
  { size: '2.6rem', top: '30%', duration: '53s', delay: '-31s', opacity: 0.38 },
  { size: '4.2rem', top: '42%', duration: '78s', delay: '-58s', opacity: 0.29 },
  { size: '3.2rem', top: '55%', duration: '62s', delay: '-41s', opacity: 0.35 },
  { size: '2.5rem', top: '68%', duration: '55s', delay: '-22s', opacity: 0.4 },
  { size: '3.9rem', top: '78%', duration: '72s', delay: '-54s', opacity: 0.31 },
  { size: '3rem', top: '89%', duration: '64s', delay: '-8s', opacity: 0.36 },
];

export default function FloatingEnsos() {
  return (
    <div className={styles.scene} aria-hidden="true">
      {CIRCLES.map((circle, index) => (
        <span
          key={index}
          className={styles.circle}
          style={{
            '--enso-size': circle.size,
            '--enso-top': circle.top,
            '--enso-duration': circle.duration,
            '--enso-delay': circle.delay,
            '--enso-opacity': circle.opacity,
          }}
        >
          <EnsoIcon className={styles.icon} />
        </span>
      ))}
    </div>
  );
}
