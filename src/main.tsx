// Force HTTPS redirect
if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
  window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.search;
}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config';

createRoot(document.getElementById("root")!).render(<App />);