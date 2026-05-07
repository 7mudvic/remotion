import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the service worker so the menu works offline once it's
// been opened on the device. We delay registration until the page is
// fully loaded so it never competes with the first render.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL('sw.js', document.baseURI).href)
      .catch(() => {
        // ignore: offline support is a nice-to-have, not required
      });
  });
}
