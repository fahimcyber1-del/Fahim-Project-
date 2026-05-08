import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppearanceProvider } from './components/setting/AppearanceContext.tsx';
import { initApiStorage } from './utils/apiStorage.ts';

initApiStorage().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </StrictMode>,
  );
});
