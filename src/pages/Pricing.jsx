import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from '@/components/landing/Footer';

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
      'Score de confiance',
      'Recommandations EPI'
    ],
    notIncluded: [
      'Export CSV',
      'Support prioritaire',
      'Multi-utilisateurs',
      'Accès API'
    ],
    cta: 'Commencer l\'essai',
    popular: false,
    highlight: false
  },
  {
    name: 'Standard',
    price: '29€',
    period: '/mois HT',
    description: 'Pour les professionnels HSE et laboratoires',
    features: [
      '100 analyses / mois',
      'Tableau RAMPE complet',
      'Export PDF & CSV',
      'Tous les codes H & P',
      'Recommandations EPI détaillées',
      'Incompatibilités chimiques',
      'Support prioritaire par email',
      'Historique des métadonnées'
    ],
    notIncluded: [
      'Multi-utilisateurs',
      'Accès API'
    ],
    cta: 'Choisir Standard',
    popular: true,
    highlight: true
  },
  {
    name: 'Entreprise',
    price: '89€',
    period: '/mois HT',
    description: 'Pour les équipes et grandes organisations',
    features: [
      'Analyses illimitées',
      'Multi-utilisateurs (5 max)',
      'Accès API REST',
      'Tableau RAMPE avancé',
      'Tous les exports',
      'Intégrations personnalisées',
      'Support dédié 24/7',
      'SLA garanti 99.9%',
      'Formation incluse'
    ],
    notIncluded: [],
    cta: 'Contacter les ventes',
    popular: false,
    highlight: false
  }
];

const faqs = [
  {
    question: "Qu'est-ce qui est inclus dans l'essai gratuit ?",
    answer: "L'essai gratuit de 7 jours vous donne accès à toutes les fonctionnalités de la plateforme avec une limite de 10 analyses. Aucune carte bancaire n'est requise pour commencer."
  },
  {
    question: "Mes données d'analyse sont-elles conservées ?",
    answer: "Non. Conformément à notre engagement RGPD, nous ne conservons jamais le contenu de vos analyses chimiques. Seules les métadonnées anonymisées (date, nombre de substances) sont stockées pour votre historique."
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace compte. L'annulation prend effet à la fin de la période de facturation en cours."
  },
  {
    question: "Quelles sont les sources de données utilisées ?",
    answer: "ChemRisk Pro utilise des données provenant de sources officielles comme PubChem (NIH), l'ECHA et les bases réglementaires GHS. Chaque analyse inclut un score de confiance et les références des sources."
  },
  {
    question: "L'API est-elle disponible avec le plan Standard ?",
    answer: "Non, l'accès API REST est réservé au plan Entreprise. Le plan Standard permet l'utilisation via l'interface web uniquement."
  },
  {
    question: "Comment fonctionne la facturation ?",
    answer: "La facturation est mensuelle et automatique via Stripe. Vous recevez une facture conforme à chaque paiement. La TVA est calculée selon votre pays de résidence."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Tarifs simples et transparents
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choisissez le plan adapté à vos besoins. 
              Commencez gratuitement, évoluez selon votre usage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlight 
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105 z-10' 
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

                <div className="mb-8">
                  <h3 className={`text-xl font-semibold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                    <span className={plan.highlight ? 'text-slate-400' : 'text-slate-500'}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-3 ${plan.highlight ? 'text-slate-400' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? 'text-emerald-400' : 'text-emerald-500'
                      }`} />
                      <span className={plan.highlight ? 'text-slate-300' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 opacity-50">
                      <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center">—</span>
                      <span className={plan.highlight ? 'text-slate-500' : 'text-slate-400'}>
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
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-xl border border-slate-200 px-6"
              >
                <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Prêt à essayer ChemRisk Pro ?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Commencez votre essai gratuit de 7 jours dès maintenant. 
            Aucune carte bancaire requise.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl">
              Démarrer l'essai gratuit
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}