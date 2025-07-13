import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { COLORS, TYPOGRAPHY } from './utils/designTokens';

const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.style.backgroundColor = COLORS.background;
  rootElement.style.color = COLORS.text;
  rootElement.style.fontFamily = TYPOGRAPHY.fontFamily.primary;
}

createRoot(rootElement!).render(<App />);
