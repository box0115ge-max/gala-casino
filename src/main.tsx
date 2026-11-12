import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Invitation from './components/Invitation';
import './styles/global.css';
import './styles/invitation.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Invitation />
  </StrictMode>,
);
