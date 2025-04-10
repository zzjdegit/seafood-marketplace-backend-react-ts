import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

prepare().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    process.env.NODE_ENV === 'development' ? (
      <App />
    ) : (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  );
});