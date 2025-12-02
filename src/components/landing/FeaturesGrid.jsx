import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FlaskConical, 
  Shield, 
  FileText, 
  Zap, 
  Database, 
  Lock,
  AlertTriangle,
  Download,
  Users
} from 'lucide-react';

const features = [
  {
    icon: FlaskConical,
    title: 'Identification automatique',
    description: 'Extraction automatique des numéros CAS, noms IUPAC et identifiants chimiques.',
    color: 'emerald',
    link: 'Features#identification'
  },
  {
    icon: AlertTriangle,
    title: 'Classification GHS',
    description: 'Identification des pictogrammes, mentions de danger et classes de risque.',
    color: 'orange',
    link: 'Features#ghs'
  },
  {
    icon: FileText,
    title: 'Tableau RAMPE complet',
    description: 'Génération automatique conforme aux standards HSE européens.',
    color: 'blue',
    link: 'Features#rampe'
  },
  {
    icon: Shield,
    title: 'Codes H & P',
    description: 'Extraction exhaustive des mentions de danger et conseils de prudence.',
    color: 'red',
    link: 'Features#codes-hp'
  },
  {
    icon: Zap,
    title: 'Analyse en < 3 secondes',
    description: 'Moteur IA optimisé pour des résultats instantanés et précis.',
    color: 'yellow',
    link: 'Features'
  },
  {
    icon: Database,
    title: 'Sources vérifiées',
    description: 'Données issues de PubChem, ECHA et bases réglementaires officielles.',
    color: 'purple',
    link: 'Features#sources'
  },
  {
    icon: Download,
    title: 'Export PDF & CSV',
    description: 'Téléchargez vos analyses dans les formats standards de l\'industrie.',
    color: 'cyan',
    link: 'Features#rampe'
  },
  {
    icon: Lock,
    title: 'RGPD natif',
    description: 'Aucune conservation des analyses. Vos données restent confidentielles.',
    color: 'slate',
    link: 'Security'
  },
  {
    icon: Users,
    title: 'Multi-utilisateurs',
    description: 'Plan Entreprise avec gestion d\'équipe et accès API dédié.',
    color: 'pink',
    link: 'Pricing'
  }
];

const colorClasses = {
  emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white',
  orange: 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white',
  blue: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white',
  red: 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white',
  yellow: 'bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white',
  purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white',
  cyan: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white',
  slate: 'bg-slate-500/10 text-slate-500 group-hover:bg-slate-500 group-hover:text-white',
  pink: 'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white'
};

export default function FeaturesGrid() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tout pour l'analyse de risques chimiques
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Une plateforme complète qui automatise vos évaluations HSE 
            tout en respectant les normes les plus strictes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link 
              key={feature.title}
              to={createPageUrl(feature.link)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 cursor-pointer h-full"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${colorClasses[feature.color]}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}