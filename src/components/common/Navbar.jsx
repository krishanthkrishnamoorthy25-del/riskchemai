import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { FlaskConical, Menu, X, LogOut, User, Moon, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ isDark = false, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const navLinks = [
    { name: 'Fonctionnalités', page: 'Features' },
    { name: 'Tarifs', page: 'Pricing' },
    { name: 'Actualités', page: 'News' }
  ];

  const userMenuLinks = [
    { name: 'Dashboard', page: 'Dashboard' },
    { name: 'Mon compte', page: 'Account' }
  ];

  const isLandingPage = location.pathname === '/' || location.pathname === '/Home';
  const isDarkNav = isLandingPage && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200' 
        : isDarkNav 
          ? 'bg-transparent' 
          : 'bg-white border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkNav ? 'text-white' : 'text-slate-900'}`}>
              ChemRisk <span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.page)}
                className={`text-sm font-medium transition-colors ${
                  isDarkNav 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${
                  isDarkNav 
                    ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`gap-2 ${isDarkNav ? 'text-white hover:bg-white/10' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="max-w-32 truncate">{user.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userMenuLinks.map((link) => (
                      <DropdownMenuItem key={link.page} asChild>
                        <Link to={createPageUrl(link.page)} className="cursor-pointer">
                          {link.name === 'Mon compte' && <User className="w-4 h-4 mr-2" />}
                          {link.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => base44.auth.redirectToLogin()}
                  className={`rounded-xl font-medium ${isDarkNav ? 'text-white hover:bg-white/10' : 'hover:bg-slate-100'}`}
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 font-medium px-5"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Essai gratuit
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg ${isDarkNav ? 'text-white' : 'text-slate-900'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.page)}
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-600 hover:text-slate-900 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Theme Toggle Mobile */}
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {isDark ? 'Mode clair' : 'Mode sombre'}
                </button>
              )}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {user ? (
                  <>
                    <Link to={createPageUrl('Dashboard')} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => base44.auth.logout()}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => base44.auth.redirectToLogin()}
                    >
                      Connexion
                    </Button>
                    <Button 
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => base44.auth.redirectToLogin()}
                    >
                      Essai gratuit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}