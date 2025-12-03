/**
 * Configuration centralisée de l'application ChemRisk AI
 * Facilite le déploiement et la personnalisation
 */

// Configuration de l'application
export const APP_CONFIG = {
  // Informations générales
  name: 'ChemRisk AI',
  tagline: 'Analyse de risques chimiques par IA',
  version: '1.0.0',
  
  // URLs
  urls: {
    website: 'https://chemrisk.ai',
    documentation: 'https://docs.chemrisk.ai',
    support: 'https://support.chemrisk.ai',
    privacy: '/Privacy',
    terms: '/Terms'
  },
  
  // Contact
  contact: {
    email: 'contact@chemrisk.ai',
    support: 'support@chemrisk.ai'
  },
  
  // Réseaux sociaux
  social: {
    twitter: '',
    linkedin: '',
    github: ''
  },
  
  // Fonctionnalités
  features: {
    darkMode: true,
    multiLanguage: true,
    analytics: true,
    newsletter: true,
    dailyGame: true
  },
  
  // Limites par plan
  plans: {
    trial: {
      name: 'Essai Gratuit',
      rampeAnalyses: 10,
      simulations: 5,
      durationDays: 7
    },
    student: {
      name: 'Étudiant',
      rampeAnalyses: 30,
      simulations: 15,
      price: 9.90
    },
    standard: {
      name: 'PME / Artisans',
      rampeAnalyses: 100,
      simulations: 50,
      price: 49
    },
    enterprise: {
      name: 'Entreprise',
      rampeAnalyses: Infinity,
      simulations: Infinity,
      price: 199
    }
  },
  
  // Sources de données
  dataSources: [
    { name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov', type: 'primary' },
    { name: 'ECHA', url: 'https://echa.europa.eu', type: 'primary' },
    { name: 'INRS', url: 'https://www.inrs.fr', type: 'secondary' },
    { name: 'ORD', url: 'https://open-reaction-database.org', type: 'secondary' }
  ],
  
  // Régions supportées
  regions: ['EU', 'FR'],
  
  // Conformité
  compliance: {
    gdpr: true,
    hostingRegion: 'EU',
    dataRetention: 'session-only'
  }
};

// Variables d'environnement (avec fallbacks pour dev)
export const ENV_CONFIG = {
  // Détection de l'environnement
  isDevelopment: typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'),
  isProduction: typeof window !== 'undefined' && 
    !['localhost', '127.0.0.1'].includes(window.location.hostname),
  
  // API Base44 - ces valeurs sont injectées par la plateforme Base44
  // En cas de déploiement standalone, utilisez les variables d'environnement Vite
  base44: {
    appId: typeof import.meta !== 'undefined' ? import.meta.env?.VITE_BASE44_APP_ID : null,
    apiUrl: typeof import.meta !== 'undefined' ? import.meta.env?.VITE_BASE44_API_URL : null
  }
};

// Couleurs du thème
export const THEME_CONFIG = {
  colors: {
    primary: '#10b981', // emerald-500
    primaryDark: '#059669', // emerald-600
    secondary: '#0ea5e9', // sky-500
    accent: '#8b5cf6', // violet-500
    danger: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    success: '#22c55e', // green-500
  },
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'JetBrains Mono, monospace'
  }
};

// Métadonnées SEO
export const SEO_CONFIG = {
  defaultTitle: 'ChemRisk AI - Analyse de risques chimiques par IA',
  titleTemplate: '%s | ChemRisk AI',
  description: 'Plateforme d\'analyse de risques chimiques par intelligence artificielle. Identifiez les dangers, protections et incompatibilités de vos substances.',
  keywords: [
    'risque chimique',
    'sécurité chimique',
    'HSE',
    'analyse RAMPE',
    'FDS',
    'GHS',
    'pictogrammes',
    'EPI',
    'laboratoire',
    'INRS',
    'ECHA',
    'PubChem'
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'ChemRisk AI'
  },
  twitter: {
    cardType: 'summary_large_image'
  }
};

// Export par défaut
export default {
  APP_CONFIG,
  ENV_CONFIG,
  THEME_CONFIG,
  SEO_CONFIG
};