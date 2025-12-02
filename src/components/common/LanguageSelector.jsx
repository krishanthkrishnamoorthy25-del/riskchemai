import React, { useState, useEffect, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Context pour la langue
export const LanguageContext = createContext({ lang: 'fr', setLang: () => {}, t: (key) => key });

export const useLanguage = () => useContext(LanguageContext);

// Traductions
const translations = {
  fr: {
    // Navbar
    'nav.features': 'Fonctionnalités',
    'nav.pricing': 'Tarifs',
    'nav.news': 'Actualités',
    'nav.dashboard': 'Dashboard',
    'nav.account': 'Mon compte',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.trial': 'Essai gratuit',
    
    // Hero
    'hero.badge': 'RGPD • Données non conservées',
    'hero.title': 'Analyse de risques chimiques par IA',
    'hero.subtitle': 'Identifiez instantanément les dangers, codes GHS, EPI requis et incompatibilités de vos substances chimiques.',
    'hero.cta': 'Commencer gratuitement',
    'hero.features': 'Voir les fonctionnalités',
    
    // Dashboard
    'dashboard.welcome': 'Bonjour',
    'dashboard.subtitle': 'Bienvenue sur votre tableau de bord ChemRisk AI',
    'dashboard.new_analysis': 'Nouvelle analyse',
    'dashboard.account': 'Compte',
    
    // Analysis
    'analysis.title': 'Nouvelle analyse RAMPE',
    'analysis.substance': 'Substance',
    'analysis.cas': 'Numéro CAS',
    'analysis.role': 'Rôle',
    'analysis.add': 'Ajouter',
    'analysis.analyze': 'Analyser',
    'analysis.analyzing': 'Analyse en cours...',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.export': 'Exporter',
    'common.download': 'Télécharger',
    'common.copy': 'Copier',
    'common.copied': 'Copié !',
    
    // Security
    'security.title': 'Sécurité',
    'security.subtitle': 'Protection de vos données',
  },
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.news': 'News',
    'nav.dashboard': 'Dashboard',
    'nav.account': 'My Account',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.trial': 'Free Trial',
    
    // Hero
    'hero.badge': 'GDPR • No data storage',
    'hero.title': 'AI-Powered Chemical Risk Analysis',
    'hero.subtitle': 'Instantly identify hazards, GHS codes, required PPE and incompatibilities of your chemical substances.',
    'hero.cta': 'Start for free',
    'hero.features': 'See features',
    
    // Dashboard
    'dashboard.welcome': 'Hello',
    'dashboard.subtitle': 'Welcome to your ChemRisk AI dashboard',
    'dashboard.new_analysis': 'New analysis',
    'dashboard.account': 'Account',
    
    // Analysis
    'analysis.title': 'New RAMPE Analysis',
    'analysis.substance': 'Substance',
    'analysis.cas': 'CAS Number',
    'analysis.role': 'Role',
    'analysis.add': 'Add',
    'analysis.analyze': 'Analyze',
    'analysis.analyzing': 'Analyzing...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.export': 'Export',
    'common.download': 'Download',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    
    // Security
    'security.title': 'Security',
    'security.subtitle': 'Data Protection',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'fr';
    }
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['fr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="hidden sm:inline text-sm">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLang(language.code)}
            className={lang === language.code ? 'bg-slate-100' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}