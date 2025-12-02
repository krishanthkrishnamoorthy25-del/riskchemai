import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from '@/components/common/Navbar';
import CookieBanner from '@/components/common/CookieBanner';
import AccessibilityPanel from '@/components/common/AccessibilityPanel';
import { Toaster } from 'sonner';

// Theme Context
export const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function Layout({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <style>{`
          :root {
            --color-primary: #10b981;
            --color-primary-dark: #059669;
            --color-secondary: #0ea5e9;
          }
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar - Light */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${isDark ? '#1e293b' : '#f1f5f9'};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDark ? '#475569' : '#cbd5e1'};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#64748b' : '#94a3b8'};
          }

          /* Dark mode overrides */
          .dark-mode-text {
            color: ${isDark ? '#f1f5f9' : '#0f172a'};
          }
          
          .dark-mode-bg {
            background-color: ${isDark ? '#0f172a' : '#ffffff'};
          }
          
          .dark-mode-card {
            background-color: ${isDark ? '#1e293b' : '#ffffff'};
            border-color: ${isDark ? '#334155' : '#e2e8f0'};
          }
        `}</style>
        
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <main>
          {children}
        </main>
        
        <CookieBanner />
        <AccessibilityPanel />
        <Toaster position="top-right" richColors theme={isDark ? 'dark' : 'light'} />
      </div>
    </ThemeContext.Provider>
  );
}