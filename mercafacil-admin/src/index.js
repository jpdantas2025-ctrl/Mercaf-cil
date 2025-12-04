import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you might have a generic css or relying on Tailwind injection in HTML
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);