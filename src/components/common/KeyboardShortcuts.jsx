import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  { keys: ['⌘', 'K'], description: 'Recherche globale' },
  { keys: ['⌘', 'N'], description: 'Nouvelle analyse' },
  { keys: ['⌘', 'R'], description: 'Simuler réaction' },
  { keys: ['⌘', 'E'], description: 'Exporter PDF' },
  { keys: ['⌘', ','], description: 'Paramètres' },
  { keys: ['?'], description: 'Afficher raccourcis' },
  { keys: ['Esc'], description: 'Fermer modal' },
];

export default function KeyboardShortcuts({ onShortcut }) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ? to show shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp(true);
      }

      // Cmd/Ctrl + N for new analysis
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        if (onShortcut) onShortcut('new-analysis');
      }

      // Cmd/Ctrl + R for reaction simulator
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        if (onShortcut) onShortcut('simulator');
      }

      // Cmd/Ctrl + E for export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (onShortcut) onShortcut('export');
      }

      // Escape to close
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onShortcut]);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors z-40"
        title="Raccourcis clavier (?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Raccourcis clavier</h3>
                </div>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-slate-400 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center">
                  Appuyez sur <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">?</kbd> à tout moment pour afficher cette aide
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}