/**
 * ============================================
 * CHEMRISK AI - GUIDE DE DÉPLOIEMENT
 * ============================================
 * 
 * Ce fichier contient les informations pour déployer l'application
 * sur GitHub et Vercel.
 * 
 * PRÉREQUIS:
 * - Node.js 18+ 
 * - npm ou yarn
 * - Compte GitHub
 * - Compte Vercel (gratuit)
 * 
 * ============================================
 * STRUCTURE DU PROJET
 * ============================================
 * 
 * /
 * ├── components/          # Composants React réutilisables
 * │   ├── analysis/        # Composants d'analyse chimique
 * │   ├── common/          # Composants communs (Navbar, Footer, etc.)
 * │   ├── dashboard/       # Composants du tableau de bord
 * │   ├── games/           # Jeux éducatifs
 * │   ├── landing/         # Sections de la page d'accueil
 * │   └── ui/              # Composants UI (shadcn/ui)
 * ├── pages/               # Pages de l'application
 * ├── entities/            # Schémas JSON des entités (base de données)
 * ├── functions/           # Fonctions backend (Deno/Edge)
 * ├── Layout.js            # Layout principal
 * └── globals.css          # Styles globaux
 * 
 * ============================================
 * VARIABLES D'ENVIRONNEMENT REQUISES
 * ============================================
 * 
 * Créez un fichier .env.local avec:
 * 
 * # Base44 Platform
 * VITE_BASE44_APP_ID=your_app_id
 * VITE_BASE44_API_URL=https://api.base44.com
 * 
 * # Optionnel - Analytics
 * VITE_GA_ID=your_google_analytics_id
 * 
 * ============================================
 * DÉPLOIEMENT SUR VERCEL
 * ============================================
 * 
 * 1. Connectez votre repo GitHub à Vercel
 * 2. Configurez les variables d'environnement dans Vercel Dashboard
 * 3. Build Command: npm run build
 * 4. Output Directory: dist
 * 5. Install Command: npm install
 * 
 * ============================================
 * SCRIPTS DISPONIBLES
 * ============================================
 * 
 * npm run dev      # Développement local
 * npm run build    # Build production
 * npm run preview  # Preview du build
 * npm run lint     # Lint du code
 * 
 * ============================================
 * TECHNOLOGIES UTILISÉES
 * ============================================
 * 
 * - React 18
 * - Vite
 * - Tailwind CSS
 * - shadcn/ui
 * - React Query (TanStack)
 * - Framer Motion
 * - Lucide Icons
 * - React Router DOM
 * - date-fns
 * - Recharts
 * 
 * ============================================
 * SÉCURITÉ
 * ============================================
 * 
 * - Toutes les entrées utilisateur sont sanitisées
 * - Filtre anti-abus sur les recherches chimiques
 * - Authentification gérée par Base44
 * - Données hébergées en UE (RGPD compliant)
 * - Aucune donnée sensible côté client
 * 
 * ============================================
 * CONTACT & SUPPORT
 * ============================================
 * 
 * Pour toute question: contact@chemrisk.ai
 * Documentation: https://docs.chemrisk.ai
 * 
 */

// Ce composant n'est pas rendu, il sert de documentation
export default function DeploymentReadme() {
  return null;
}

// Export des métadonnées pour le déploiement
export const deploymentConfig = {
  name: 'ChemRisk AI',
  version: '1.0.0',
  description: 'Plateforme d\'analyse de risques chimiques par IA',
  
  // Build configuration
  build: {
    command: 'npm run build',
    outputDir: 'dist',
    nodeVersion: '18.x'
  },
  
  // Required environment variables
  envVars: [
    { name: 'VITE_BASE44_APP_ID', required: true, description: 'Base44 App ID' },
    { name: 'VITE_BASE44_API_URL', required: true, description: 'Base44 API URL' }
  ],
  
  // Vercel configuration
  vercel: {
    framework: 'vite',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    devCommand: 'npm run dev'
  },
  
  // Dependencies versions
  dependencies: {
    react: '^18.2.0',
    vite: '^5.0.0',
    tailwindcss: '^3.4.0'
  }
};