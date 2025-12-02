import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FlaskConical, FileText, Settings, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const searchItems = [
  { type: 'action', icon: FlaskConical, label: 'Nouvelle analyse RAMPE', shortcut: 'N', action: 'new-analysis' },
  { type: 'action', icon: FlaskConical, label: 'Simuler une réaction', shortcut: 'R', action: 'simulator' },
  { type: 'page', icon: FileText, label: 'Tableau de bord', page: 'Dashboard' },
  { type: 'page', icon: Settings, label: 'Mon compte', page: 'Account' },
  { type: 'page', icon: FileText, label: 'Tarifs', page: 'Pricing' },
  { type: 'page', icon: HelpCircle, label: 'Centre d\'aide', page: 'Support' },
  { type: 'page', icon: FileText, label: 'Sources scientifiques', page: 'Sources' },
];

export default function GlobalSearch({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filteredItems = searchItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  const handleSelect = (item) => {
    if (item.type === 'page') {
      navigate(createPageUrl(item.page));
    } else if (item.type === 'action' && onAction) {
      onAction(item.action);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors"
      >
        <Search className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-500 hidden sm:inline">Rechercher...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-400 bg-slate-100 rounded">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher une action ou une page..."
                  className="flex-1 outline-none text-slate-900 placeholder:text-slate-400"
                />
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <p>Aucun résultat pour "{query}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredItems.map((item, index) => (
                      <button
                        key={item.label}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          index === selectedIndex 
                            ? 'bg-emerald-50 text-emerald-900' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${index === selectedIndex ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.shortcut && (
                          <kbd className="px-2 py-0.5 text-xs bg-slate-100 rounded text-slate-500">
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↓</kbd>
                    naviguer
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd>
                    sélectionner
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border">esc</kbd>
                  fermer
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}