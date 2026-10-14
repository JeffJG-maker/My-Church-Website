
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

function Root() {
  useEffect(() => {
    let hideScrollbarTimer;

    const handleScroll = () => {
      document.body.classList.add('is-scrolling');

      window.clearTimeout(hideScrollbarTimer);

      hideScrollbarTimer = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 700);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(hideScrollbarTimer);
      document.body.classList.remove('is-scrolling');
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
