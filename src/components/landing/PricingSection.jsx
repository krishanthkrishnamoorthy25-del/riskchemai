import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Essai Gratuit',
    price: '0€',
    period: '7 jours',
    description: 'Découvrez toutes les fonctionnalités sans engagement',
    features: [
      '10 analyses complètes',
      'Tableau RAMPE',
      'Export PDF',
      'Codes H & P',
      'Score de confiance'
    ],
    cta: 'Commencer l\'essai',
    popular: false,
    highlight: false
  },
  {
    name: 'Standard',
    price: '29€',
    period: '/mois',
    description: 'Pour les professionnels HSE et laboratoires',
    features: [
      '100 analyses / mois',
      'Tableau RAMPE complet',
      'Export PDF & CSV',
      'Tous les codes H & P',
      'Recommandations EPI',
      'Incompatibilités',
      'Support prioritaire'
    ],
    cta: 'Choisir Standard',
    popular: true,
    highlight: true
  },
  {
    name: 'Entreprise',
    price: '89€',
    period: '/mois',
    description: 'Pour les équipes et grandes organisations',
    features: [
      'Analyses illimitées',
      'Multi-utilisateurs (5 max)',
      'Accès API REST',
      'Tableau RAMPE avancé',
      'Tous les exports',
      'Intégrations personnalisées',
      'Support dédié 24/7',
      'SLA garanti'
    ],
    cta: 'Contacter les ventes',
    popular: false,
    highlight: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choisissez le plan adapté à vos besoins. 
            Commencez gratuitement, évoluez selon votre usage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlight 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105' 
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlight ? 'text-slate-400' : 'text-slate-500'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.highlight ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={plan.highlight ? 'text-slate-300' : 'text-slate-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  className={`w-full py-6 text-base rounded-xl ${
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
          className="text-center mt-12 text-slate-500"
        >
          Tous les prix sont HT. TVA applicable selon votre pays de résidence.
        </motion.p>
      </div>
    </section>
  );
}