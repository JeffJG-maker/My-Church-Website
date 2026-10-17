
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

function Root() {
  useEffect(() => {
    const timers = new WeakMap();

    const handleScroll = (event) => {
      const target =
        event.target === document
          ? document.documentElement
          : event.target;

      if (!(target instanceof HTMLElement)) return;

      target.classList.add('is-scrolling');

      window.clearTimeout(timers.get(target));

      const timer = window.setTimeout(() => {
        target.classList.remove('is-scrolling');
        timers.delete(target);
      }, 800);

      timers.set(target, timer);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

