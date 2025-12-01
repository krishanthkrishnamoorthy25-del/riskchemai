import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const saveConsent = async (acceptAll = false) => {
    const finalPrefs = acceptAll 
      ? { functional: true, analytics: true, marketing: true }
      : preferences;

    localStorage.setItem('cookie_consent', JSON.stringify({
      ...finalPrefs,
      timestamp: new Date().toISOString()
    }));

    // Try to save to database if user is logged in
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        await base44.entities.CookieConsent.create({
          user_email: user.email,
          analytics_accepted: finalPrefs.analytics,
          marketing_accepted: finalPrefs.marketing,
          functional_accepted: finalPrefs.functional,
          consent_date: new Date().toISOString()
        });
      }
    } catch (e) {
      // Silent fail - consent is saved locally
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-4xl mx-auto">
          {showSettings ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Paramètres des cookies</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Functional - Always on */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Cookies fonctionnels</p>
                    <p className="text-sm text-slate-500">Nécessaires au fonctionnement du site</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Cookies analytiques</p>
                    <p className="text-sm text-slate-500">Pour améliorer nos services</p>
                  </div>
                  <Switch 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => setPreferences({...preferences, analytics: checked})}
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Cookies marketing</p>
                    <p className="text-sm text-slate-500">Pour des contenus personnalisés</p>
                  </div>
                  <Switch 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => setPreferences({...preferences, marketing: checked})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => saveConsent(false)}
                >
                  Enregistrer mes choix
                </Button>
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => saveConsent(true)}
                >
                  Tout accepter
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-slate-300 text-sm">
                  Nous utilisons des cookies pour améliorer votre expérience. 
                  Aucune donnée d'analyse chimique n'est conservée.
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramétrer
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => saveConsent(true)}
                >
                  Accepter
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}