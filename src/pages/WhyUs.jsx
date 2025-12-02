import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  Zap, Shield, Clock, Brain, Database, Lock,
  CheckCircle2, XCircle, ArrowRight, Globe, Heart,
  Award, Users, Sparkles
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const comparisons = [
  {
    feature: 'Temps d\'analyse',
    chemrisk: '30 secondes',
    traditional: '2-4 heures',
    advantage: true
  },
  {
    feature: 'Coût mensuel',
    chemrisk: 'À partir de 9,90€',
    traditional: '500€+ (consultant)',
    advantage: true
  },
  {
    feature: 'Disponibilité',
    chemrisk: '24h/24, 7j/7',
    traditional: 'Heures ouvrées',
    advantage: true
  },
  {
    feature: 'Mise à jour réglementaire',
    chemrisk: 'Automatique',
    traditional: 'Manuelle',
    advantage: true
  },
  {
    feature: 'Multi-substances',
    chemrisk: 'Illimité',
    traditional: 'Limité',
    advantage: true
  },
  {
    feature: 'Conformité RGPD',
    chemrisk: '100%',
    traditional: 'Variable',
    advantage: true
  }
];

const advantages = [
  {
    icon: Zap,
    title: 'Rapidité inégalée',
    description: 'Analyse complète en 30 secondes grâce à notre moteur IA propriétaire. Fini les heures de recherche dans les FDS.',
    color: 'bg-yellow-500'
  },
  {
    icon: Brain,
    title: 'Intelligence artificielle avancée',
    description: 'Notre IA croise les données PubChem, ECHA, et nos bases propriétaires pour une précision maximale.',
    color: 'bg-purple-500'
  },
  {
    icon: Database,
    title: 'Sources fiables',
    description: 'Données issues exclusivement de bases officielles : PubChem, ECHA, INRS, ORD. Aucune donnée inventée.',
    color: 'bg-blue-500'
  },
  {
    icon: Lock,
    title: 'Confidentialité absolue',
    description: 'Aucune analyse n\'est conservée. Vos données restent les vôtres, conformément au RGPD.',
    color: 'bg-emerald-500'
  },
  {
    icon: Shield,
    title: 'Sécurité enterprise',
    description: 'Chiffrement AES-256, hébergement EU, certifications en cours (ISO 27001).',
    color: 'bg-red-500'
  },
  {
    icon: Globe,
    title: 'Made in France',
    description: 'Développé en France, hébergé en Europe. Support en français par des experts chimistes.',
    color: 'bg-indigo-500'
  }
];

const stats = [
  { value: '10,000+', label: 'Analyses réalisées' },
  { value: '500+', label: 'Utilisateurs actifs' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '4.8/5', label: 'Satisfaction client' }
];

export default function WhyUs() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">La différence ChemRisk AI</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Pourquoi nous choisir ?
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              ChemRisk AI combine la puissance de l'intelligence artificielle avec la rigueur 
              scientifique pour révolutionner l'analyse de risques chimiques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              6 raisons de nous faire confiance
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((adv, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${adv.color} rounded-xl flex items-center justify-center mb-4`}>
                  <adv.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{adv.title}</h3>
                <p className="text-slate-600">{adv.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ChemRisk AI vs. Méthodes traditionnelles
            </h2>
            <p className="text-slate-600">
              Comparez notre solution aux approches conventionnelles
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold text-slate-700">
              <div>Critère</div>
              <div className="text-center text-emerald-600">ChemRisk AI</div>
              <div className="text-center">Traditionnel</div>
            </div>
            {comparisons.map((comp, index) => (
              <div key={index} className="grid grid-cols-3 p-4 border-t border-slate-100 items-center">
                <div className="text-slate-700">{comp.feature}</div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {comp.chemrisk}
                  </span>
                </div>
                <div className="text-center text-slate-500">
                  {comp.traditional}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Une équipe passionnée par la sécurité chimique
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                ChemRisk AI est né de la frustration de chimistes face aux outils existants : 
                trop complexes, trop lents, trop chers. Notre mission est de démocratiser 
                l'accès à une analyse de risques de qualité professionnelle.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Équipe pluridisciplinaire : chimistes, ingénieurs, experts HSE</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Passion pour la sécurité et l'innovation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Support réactif et personnalisé</span>
                </li>
              </ul>
              <Link to={createPageUrl('About')}>
                <Button variant="outline" className="gap-2">
                  En savoir plus sur nous
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Notre engagement</h3>
                  <p className="text-slate-600 mb-6">
                    Fournir des analyses fiables, rapides et accessibles à tous les professionnels de la chimie.
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">100%</p>
                      <p className="text-xs text-slate-500">Made in France</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">0</p>
                      <p className="text-xs text-slate-500">Données conservées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">24/7</p>
                      <p className="text-xs text-slate-500">Disponibilité</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Convaincu ? Testez gratuitement pendant 7 jours
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Aucune carte bancaire requise. Accès complet à toutes les fonctionnalités.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg">
              Démarrer mon essai gratuit
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}