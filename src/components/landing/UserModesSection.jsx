import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  GraduationCap, 
  Building2, 
  Factory,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Shield,
  Cog,
  FileText,
  Users,
  Beaker
} from 'lucide-react';

const modes = [
  {
    id: 'school',
    name: 'Mode École',
    icon: GraduationCap,
    color: 'blue',
    description: 'Parfait pour l\'enseignement et la formation HSE',
    audience: 'Universités, lycées techniques, centres de formation',
    features: [
      { icon: BookOpen, text: 'Interface simplifiée et pédagogique' },
      { icon: Shield, text: 'Contenu sécurisé et adapté' },
      { icon: Users, text: 'Gestion des groupes étudiants' },
      { icon: FileText, text: 'Fiches récapitulatives illustrées' },
      { icon: Beaker, text: 'Exercices et quiz intégrés' }
    ],
    price: '9€/mois',
    priceNote: 'par enseignant'
  },
  {
    id: 'pme',
    name: 'Mode PME',
    icon: Building2,
    color: 'emerald',
    description: 'Solution clé-en-main pour les petites structures',
    audience: 'Laboratoires, startups, PME industrielles',
    features: [
      { icon: Cog, text: 'Procédures automatisées complètes' },
      { icon: Shield, text: 'Gestion des risques simplifiée' },
      { icon: FileText, text: 'Documents réglementaires prêts' },
      { icon: Beaker, text: 'Suivi stockage & incompatibilités' },
      { icon: Users, text: 'Jusqu\'à 5 utilisateurs' }
    ],
    price: '29€/mois',
    priceNote: 'tout inclus',
    popular: true
  },
  {
    id: 'industry',
    name: 'Mode Industrie',
    icon: Factory,
    color: 'purple',
    description: 'Fonctionnalités avancées pour la R&D et production',
    audience: 'Grands groupes, sites SEVESO, R&D pharmaceutique',
    features: [
      { icon: Beaker, text: 'Prédictions R&D avancées' },
      { icon: FileText, text: 'Documents HSE complets (HASP, ATEX)' },
      { icon: Shield, text: 'Analyse HAZOP assistée par IA' },
      { icon: Cog, text: 'Intégrations ERP/LIMS' },
      { icon: Users, text: 'Utilisateurs illimités + API' }
    ],
    price: '89€/mois',
    priceNote: 'par site'
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    border: 'border-purple-500',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  }
};

export default function UserModesSection() {
  const [activeMode, setActiveMode] = useState('pme');

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Une solution adaptée à chaque structure
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Le seul outil qui s'adapte vraiment à vos besoins. 
            De la salle de classe à l'usine SEVESO.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100 rounded-xl p-1.5 gap-1">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const colors = colorClasses[mode.color];
              const isActive = activeMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? `bg-white shadow-md ${colors.text}` 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{mode.name}</span>
                  {mode.popular && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                      Populaire
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Mode Details */}
        <AnimatePresence mode="wait">
          {modes.map((mode) => {
            if (mode.id !== activeMode) return null;
            
            const colors = colorClasses[mode.color];
            const Icon = mode.icon;
            
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                {/* Info */}
                <div>
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl ${colors.bgLight} mb-6`}>
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-semibold ${colors.text}`}>{mode.name}</p>
                      <p className="text-xs text-slate-500">{mode.audience}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {mode.description}
                  </h3>

                  <div className="space-y-3 mb-8">
                    {mode.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.bgLight} flex items-center justify-center`}>
                          <feature.icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className="text-slate-700">{feature.text}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end gap-4 mb-6">
                    <div>
                      <span className="text-4xl font-bold text-slate-900">{mode.price}</span>
                      <span className="text-slate-500 ml-2">{mode.priceNote}</span>
                    </div>
                  </div>

                  <Link to={createPageUrl('Dashboard')}>
                    <Button size="lg" className={`bg-gradient-to-r ${colors.gradient} text-white rounded-xl gap-2 shadow-lg`}>
                      Démarrer avec {mode.name}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Visual */}
                <div className="hidden lg:block">
                  <div className={`relative p-8 rounded-3xl ${colors.bgLight} border-2 ${colors.border}/20`}>
                    <div className="absolute top-4 right-4">
                      <Icon className={`w-16 h-16 ${colors.text} opacity-20`} />
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Tableau de bord</p>
                          <p className="text-xs text-slate-500">{mode.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500">Analyses</p>
                          <p className="text-xl font-bold text-slate-900">47</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500">Ce mois</p>
                          <p className="text-xl font-bold text-slate-900">12</p>
                        </div>
                        <div className="col-span-2 p-3 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Dernière analyse</p>
                          <p className="text-sm font-medium text-emerald-700">Acide chlorhydrique - HCl</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}