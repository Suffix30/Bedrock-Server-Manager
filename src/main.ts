import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

// Load theme before mounting the app
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  const theme = JSON.parse(savedTheme);
  const root = document.documentElement;
  
  // Apply saved theme
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-bg-dark', theme.colors.background);
  root.style.setProperty('--color-bg-card', theme.colors.card);
  root.style.setProperty('--font-family', theme.font.family);
  root.style.setProperty('--font-size', theme.font.size);
  root.style.setProperty('--border-radius', theme.interface.borderRadius);
  root.style.setProperty('--animation-speed', theme.interface.animationSpeed);
  root.style.setProperty('--spacing', theme.interface.density);
}

const app = createApp(App);
app.use(createPinia());
app.mount('#app');