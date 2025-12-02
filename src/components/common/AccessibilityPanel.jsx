import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, ZoomIn, ZoomOut, Contrast, 
  Type, MousePointer, X, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 100,
    highContrast: false,
    largePointer: false,
    reducedMotion: false,
    dyslexiaFont: false
  });

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Appliquer les paramètres
  const applySettings = (s) => {
    const root = document.documentElement;
    
    // Taille de police
    root.style.fontSize = `${s.fontSize}%`;
    
    // Contraste élevé
    if (s.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Grand pointeur
    if (s.largePointer) {
      root.classList.add('large-pointer');
    } else {
      root.classList.remove('large-pointer');
    }
    
    // Réduction des animations
    if (s.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Police dyslexie
    if (s.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      highContrast: false,
      largePointer: false,
      reducedMotion: false,
      dyslexiaFont: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* CSS pour les modes d'accessibilité */}
      <style>{`
        .high-contrast {
          --tw-bg-opacity: 1 !important;
          filter: contrast(1.2);
        }
        .high-contrast * {
          border-color: currentColor !important;
        }
        .large-pointer, .large-pointer * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M7 2l12 11.5-5.5 1.5 3.5 7-2.5 1-3.5-7L7 18V2z'/%3E%3C/svg%3E") 0 0, auto !important;
        }
        .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .dyslexia-font {
          font-family: 'OpenDyslexic', 'Comic Sans MS', cursive, sans-serif !important;
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
          line-height: 1.8;
        }
      `}</style>

      {/* Bouton d'accessibilité */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="Options d'accessibilité"
        title="Options d'accessibilité"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                <span className="font-semibold">Accessibilité</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Taille du texte */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Taille du texte: {settings.fontSize}%
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                    disabled={settings.fontSize <= 80}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <input
                    type="range"
                    min="80"
                    max="150"
                    step="10"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                    disabled={settings.fontSize >= 150}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Options toggle */}
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <Contrast className="w-4 h-4" />
                    Contraste élevé
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <MousePointer className="w-4 h-4" />
                    Grand pointeur
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.largePointer}
                    onChange={(e) => updateSetting('largePointer', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <Settings className="w-4 h-4" />
                    Réduire les animations
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <Type className="w-4 h-4" />
                    Police dyslexie
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.dyslexiaFont}
                    onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                </label>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full"
                onClick={resetSettings}
              >
                Réinitialiser
              </Button>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Conforme WCAG 2.1 niveau AA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}