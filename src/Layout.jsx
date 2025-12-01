import React from 'react';
import Navbar from '@/components/common/Navbar';
import CookieBanner from '@/components/common/CookieBanner';
import { Toaster } from 'sonner';

export default function Layout({ children, currentPageName }) {
  const noNavbarPages = ['Home'];
  const showNavbar = !noNavbarPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-white">
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
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      <Navbar />
      
      <main>
        {children}
      </main>
      
      <CookieBanner />
      <Toaster position="top-right" richColors />
    </div>
  );
}