# 今日 — Today

> A quieter way to organize your day.

**Today** is a minimalist, Japanese-inspired to-do application built with React and Vite. It combines generous negative space, warm paper-like surfaces, sumi-ink typography, indigo accents, and gentle sakura highlights with practical task management.

The app is **local-first**: your tasks and appearance preference are saved in your browser, with no account, backend, or external data service required.

## Features

- **Create, edit, complete, and delete tasks** with inline editing and keyboard-friendly forms.
- **Optional due dates and categories**; overdue unfinished tasks are identified unobtrusively.
- **All / Active / Completed filters** and a live remaining-task count.
- **Drag-to-reorder** with mouse, touch, and keyboard using `@dnd-kit`.
- **Persistent task order and details** through `localStorage`.
- **Light, dark, and system appearance modes**; manual preference is remembered.
- **Responsive layout** for desktop and mobile, with accessible focus states and reduced-motion support.
- **Handcrafted enso SVG motif**, drifting miniature enso circles, a one-second ink-like mouse trail, subtle paper texture, and restrained transitions.
- **Personal footer signature** with a small MEHDI monogram logo.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19, functional components, JavaScript (JSX) |
| Tooling | Vite 8 |
| Shared task state | React `useReducer` + Context |
| Theme state | React Context + hooks |
| Styling | Plain CSS, CSS custom properties, CSS Modules |
| Sorting | `@dnd-kit/core` and `@dnd-kit/sortable` |
| Persistence | Custom `useLocalStorage` hook + isolated storage service |
| Tests | Node.js built-in test runner (`node --test`) |

No Redux, CSS framework, animation package, icon package, or backend is used. The ambient effects use CSS animations and the browser Canvas API.

## Getting started

### Requirements

- **Node.js 22.12+** (or a newer supported version)
- **npm**, included with Node.js

### Installation

Open a terminal in the project folder (PowerShell on Windows works):

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, normally **http://localhost:5173/**.

> **Upgrading from an earlier step?** Copy the *contents* of the new `todo-app` folder into your existing repository, not the folder itself. Keep your existing `.git` directory. Run `npm install` after copying so newly declared dependencies are installed. Do not copy an archive on top of your repository by deleting the old folder.

### Available commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run unit and contrast tests |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

To test the complete production workflow:

```powershell
npm test
npm run build
npm run preview
```

The `dist/` directory is generated and should not be committed to Git.

## How to use

1. **Add:** Type a task, optionally choose a due date and category, and select **Add task**.
2. **Complete:** Check the circle beside a task; check it again to return the task to active status.
3. **Edit:** Select **Edit**, change the title/date/category, then select **Save**. Select **Cancel** or press **Escape** to discard changes.
4. **Delete:** Select **Delete** to permanently remove a task. There is no undo feature yet.
5. **Filter:** Use **All**, **Active**, and **Completed** to control which tasks are visible. Filtering does not delete or modify tasks.
6. **Reorder:** Drag the six-dot handle. While a filter is active, only visible tasks change their relative order; hidden tasks keep their existing slots.
7. **Appearance:** Use the header toggle to switch between light and dark mode. Choose **Auto** to resume following your operating system's appearance.

### Keyboard shortcuts and interaction

| Action | Keyboard |
| --- | --- |
| Skip directly to main content | **Tab** to *Skip to tasks*, then **Enter** |
| Add a task | Enter a title and press **Enter** |
| Edit a task | Tab to **Edit**, then **Enter** or **Space** |
| Save changes | Press **Enter** while editing the title, or activate **Save** |
| Cancel editing | **Escape** while editing the title, or activate **Cancel** |
| Pick up a task for sorting | Tab to its drag handle, then press **Space** |
| Move the selected task | **Arrow Up** / **Arrow Down** |
| Drop the selected task | **Space** |
| Cancel an active keyboard drag | **Escape** |

The browser's native keyboard handling also works for checkboxes, date inputs, and buttons.

## Project structure

```text
todo-app/
├── public/
│   ├── favicon.svg
│   └── mehdi-logo.png        # Cropped logo from the provided artwork
├── src/
│   ├── components/
│   │   ├── background/        # FloatingEnsos + CursorTrail (ambient effects)
│   │   ├── TaskForm/          # Create tasks and optional metadata
│   │   ├── TaskList/          # Filtered list + drag-and-drop context
│   │   ├── TaskItem/          # Task card, completion, inline editing
│   │   ├── FilterBar/         # All / Active / Completed controls
│   │   ├── TaskCounter/       # Remaining tasks
│   │   ├── ThemeToggle/       # Light / dark / system controls
│   │   ├── EmptyState/        # Contextual empty-list messages
│   │   └── icons/             # Enso and grip SVG components
│   ├── context/
│   │   ├── TaskContext.jsx    # Reducer provider + task actions
│   │   └── ThemeContext.jsx   # Theme preference + system listener
│   ├── reducers/
│   │   └── taskReducer.js     # Pure task state transitions
│   ├── hooks/
│   │   ├── useLocalStorage.js # JSON persistence adapter
│   │   ├── useTasks.js        # Typed-by-convention Context accessor
│   │   └── useTheme.js        # Theme Context accessor
│   ├── services/
│   │   └── storage.js         # Browser storage boundary
│   ├── utils/
│   │   ├── task.js            # Task construction and normalization
│   │   ├── dates.js           # Date-only parsing and display
│   │   ├── generateId.js      # Task identifiers
│   │   └── theme.js           # Theme resolution helpers
│   ├── styles/
│   │   ├── tokens.css         # Typography, spacing, motion tokens
│   │   ├── themes.css         # Semantic light/dark color variables
│   │   └── base.css           # Reset, foundation, paper texture
│   ├── App.jsx                # Page composition and view filter
│   ├── App.module.css         # Page-specific styling
│   └── main.jsx               # React entry point and providers
├── tests/
│   ├── taskReducer.test.js    # Task model, storage and ordering
│   ├── theme.test.js          # Theme-preference logic
│   └── contrast.test.js       # Selected WCAG AA color combinations
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Each visual component owns its `.jsx` and `.module.css` files. Global CSS is reserved for reusable design values and foundational rules.

## Architecture and data flow

```text
TaskForm / TaskItem / TaskList
            |
         useTasks()
            |
      TaskContext provider
            |
         useReducer()
            |
        taskReducer.js
            |
       updated task array
            |
      useLocalStorage()
            |
          storage.js
            |
     browser localStorage
```

The task reducer is **pure**: it receives a state and action, then returns a new state without reading or writing browser storage. `TaskContext` exposes small actions such as `addTask`, `updateTask`, `toggleTask`, `deleteTask`, and `reorderTasks`. Persistence happens separately through a hook and service, so replacing browser storage later does not require rewriting task components.

A task has this shape:

```js
{
  id: 'unique-id',
  title: 'Review project notes',
  completed: false,
  dueDate: '2026-11-20', // or null
  category: 'Learning',   // or null
  createdAt: '2026-11-17T09:00:00.000Z',
  updatedAt: '2026-11-17T09:00:00.000Z'
}
```

Due dates use `YYYY-MM-DD` local calendar values to avoid UTC day-shift mistakes. The task array's position is the canonical sort order.

## Persistence and privacy

- Task data is stored under **`kyou.tasks.v1`**.
- Theme preference is stored under **`kyou.theme.v1`**.
- Tasks remain in the same browser profile across reloads, provided site storage is available.
- There is **no account, cloud sync, or server backup**. Clearing browser site data, using a private window, or switching browsers/devices may remove or hide your tasks.
- The storage service guards against unavailable browser storage. Invalid saved task entries are ignored when loaded.

If you later add a backend, start by changing `src/services/storage.js` and the persistence boundary, not each UI component.

## Accessibility and motion

- Native form controls and button labels support keyboard and screen-reader use.
- A keyboard-only **Skip to tasks** link bypasses the header.
- Filter controls expose their selected state, and the task list announces result counts.
- Keyboard sorting is provided through `@dnd-kit` sensors and visible drag handles.
- Focus styles are deliberately visible; focus returns to **Edit** after an edit closes.
- CSS respects `prefers-reduced-motion` to suppress decorative animations. Floating circles and the cursor trail are disabled in reduced-motion mode; the trail is also disabled for coarse/touch pointers.
- Automated contrast tests check selected normal-text color pairs against the WCAG AA **4.5:1** threshold. These are not a substitute for complete manual accessibility testing.

## Screenshots for the GitHub README

Screenshots are **not included** in this repository yet. To add them:

1. Run `npm run dev` and open the app with a few sample tasks.
2. Capture **desktop/light**, **desktop/dark**, and **mobile** views (Chrome DevTools device emulation is fine).
3. Save the images under `docs/screenshots/` with descriptive filenames such as `desktop-light.png`, `desktop-dark.png`, and `mobile.png`.
4. Add the following Markdown underneath this section, once the images exist:

```md
![Today app in light mode](docs/screenshots/desktop-light.png)
![Today app in dark mode](docs/screenshots/desktop-dark.png)
![Today app on mobile](docs/screenshots/mobile.png)
```

Avoid committing screenshots containing personal task data.

## Troubleshooting

**Vite cannot resolve `@dnd-kit/core` or `@dnd-kit/sortable`**

Install the dependencies declared in `package.json`, then retry the build:

```powershell
npm install
npm ls @dnd-kit/core @dnd-kit/sortable
npm run build
```

Do **not** mark these packages as external in Vite; they need to be bundled with the application.

**The app looks unchanged after copying a new step**

Check that you copied the files *inside* the extracted `todo-app` folder into your existing repository, rather than creating `todo-app/todo-app/`. Restart the development server and refresh the browser.

**Tasks are missing after opening the app elsewhere**

Tasks are stored per browser and origin. Open the same browser profile and local address, and check whether browser site data was cleared.

**Animations appear absent**

The fade and motion effects are intentionally restrained. Floating enso circles drift slowly, and the cursor trail fades within about one second. Reduced-motion settings disable both effects; the trail is also disabled on coarse/touch pointers.

## Ideas for future improvements

These are **not implemented** in the current version:

- Undo deletion and optional bulk completion.
- Search, multi-category tags, and task priorities.
- JSON import/export for backups and migration.
- Optional backend synchronization and user accounts.
- End-to-end interaction tests and a more extensive accessibility audit.
- A dedicated animation pass for entering, completing, deleting, and filtering tasks.
- Optional progressive-web-app support for installability and offline assets.

---

Made for a calmer, more intentional daily workflow.
