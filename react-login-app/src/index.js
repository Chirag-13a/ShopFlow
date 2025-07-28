import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './components/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DarkModeProvider } from './context/DarkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="930710046592-nnttnjj8v7mia8oc63t93fnkhcnh0t07.apps.googleusercontent.com">
      <CartProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
