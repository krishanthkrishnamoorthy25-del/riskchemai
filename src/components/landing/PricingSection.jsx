import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Essai Gratuit',
    priceMonthly: '0€',
    priceAnnual: '0€',
    period: '7 jours',
    description: 'Découvrez toutes les fonctionnalités',
    features: [
      '10 analyses complètes',
      'Tableau RAMPE',
      'Export PDF',
      'Codes H & P'
    ],
    cta: 'Commencer l\'essai',
    popular: false,
    highlight: false
  },
  {
    name: 'Étudiant',
    priceMonthly: '9,90€',
    priceAnnual: '7,90€',
    annualTotal: '95€',
    period: '/mois',
    description: 'Étudiants & laboratoires pédagogiques',
    features: [
      '200 analyses / mois',
      'Analyse IA complète',
      'Tableau RAMPE',
      'Export PDF',
      'Support email'
    ],
    cta: 'Choisir Étudiant',
    popular: false,
    highlight: false,
    badge: '🎓'
  },
  {
    name: 'PME',
    priceMonthly: '49€',
    priceAnnual: '39€',
    annualTotal: '470€',
    period: '/mois',
    description: 'PME, artisans & labos privés',
    features: [
      'Analyses illimitées',
      'Score IA avancé',
      'EPI optimisées',
      'Historique 12 mois',
      'Clé API',
      'Support prioritaire'
    ],
    cta: 'Choisir PME',
    popular: true,
    highlight: true
  },
  {
    name: 'Entreprise',
    priceMonthly: '199€',
    priceAnnual: '159€',
    annualTotal: '1 900€',
    period: '/mois',
    description: 'Industries chimiques',
    features: [
      'Multi-équipes (10 users)',
      'SLA 99,9%',
      'Connecteurs personnalisés',
      'Support + onboarding',
      'Priorité calcul IA'
    ],
    cta: 'Contacter les ventes',
    popular: false,
    highlight: false,
    badge: '🏭'
  }
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Choisissez le plan adapté à vos besoins. 
            Commencez gratuitement, évoluez selon votre usage.
          </p>
          
          {/* Toggle Mensuel / Annuel */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annuel
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                plan.highlight 
                  ? 'bg-slate-900 dark:bg-emerald-900 text-white shadow-2xl shadow-slate-900/20 scale-105 z-10' 
                  : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                    Populaire
                  </span>
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className={plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}>
                    {plan.period}
                  </span>
                </div>
                {isAnnual && plan.annualTotal && (
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Facturé {plan.annualTotal}/an
                  </p>
                )}
                <p className={`mt-2 text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      plan.highlight ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  className={`w-full py-5 text-sm rounded-xl ${
                    plan.highlight 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-slate-500 dark:text-slate-400"
        >
          Tous les prix sont HT. TVA applicable selon votre pays de résidence.
        </motion.p>
      </div>
    </section>
  );
}