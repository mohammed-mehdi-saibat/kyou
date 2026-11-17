// An intentionally unfinished ink circle: the sole decorative motif.
export default function EnsoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M106 24C83 12 54 21 36 42C12 69 17 110 44 132C68 151 107 148 130 124C151 102 149 66 130 44"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M101 31C77 20 53 31 39 48C22 71 24 104 49 126C72 144 102 138 121 120"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.32"
      />
    </svg>
  );
}
