import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timeout?: number;
  }>;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
  }),
  
  getters: {
    isDarkMode: (state) => state.theme === 'dark'
  },
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
      localStorage.setItem('theme', this.theme);
    },
    
    setTheme(theme: Theme) {
      this.theme = theme;
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    },
    
    initTheme() {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      this.setTheme(theme);
    },
    
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    
    addNotification({ type, message, timeout = 5000 }: { type: 'info' | 'success' | 'warning' | 'error', message: string, timeout?: number }) {
      const id = Date.now().toString();
      this.notifications.push({ id, type, message, timeout });
      
      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, timeout);
      }
      
      return id;
    },
    
    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    }
  }
});
