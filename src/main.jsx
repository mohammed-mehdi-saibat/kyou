import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/themes.css';
import './styles/base.css';
import App from './App.jsx';
import { TaskProvider } from './context/TaskContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>
);
