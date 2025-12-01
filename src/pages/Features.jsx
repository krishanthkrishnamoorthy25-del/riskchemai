import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  FlaskConical,
  AlertTriangle,
  FileText,
  Shield,
  Zap,
  Database,
  Download,
  Lock,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  Eye,
  Cpu
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const mainFeatures = [
  {
    icon: FlaskConical,
    title: 'Identification automatique des substances',
    description: 'Notre moteur IA extrait automatiquement les numéros CAS, noms IUPAC et identifiants chimiques à partir des noms commerciaux ou formules.',
    benefits: [
      'Reconnaissance de plus de 50 000 substances',
      'Correspondance avec les bases PubChem et ECHA',
      'Détection des synonymes et noms commerciaux'
    ]
  },
  {
    icon: AlertTriangle,
    title: 'Classification GHS complète',
    description: 'Identification automatique des pictogrammes de danger, mentions de danger et classes de risque selon le règlement CLP.',
    benefits: [
      '9 pictogrammes GHS supportés',
      'Classification conforme au règlement CE 1272/2008',
      'Mise à jour régulière des données réglementaires'
    ]
  },
  {
    icon: FileText,
    title: 'Tableau RAMPE automatique',
    description: 'Génération instantanée de tableaux RAMPE conformes aux standards HSE français et européens pour vos évaluations des risques.',
    benefits: [
      'Format conforme aux exigences réglementaires',
      'Export PDF et CSV',
      'Personnalisation des champs'
    ]
  },
  {
    icon: Shield,
    title: 'Codes H & P exhaustifs',
    description: 'Extraction complète des mentions de danger (H) et conseils de prudence (P) pour chaque substance identifiée.',
    benefits: [
      'Tous les codes H (H200-H420)',
      'Tous les codes P (P100-P500)',
      'Combinaisons et codes supplémentaires'
    ]
  },
  {
    icon: Cpu,
    title: 'Recommandations EPI intelligentes',
    description: 'Suggestions automatiques d\'équipements de protection individuelle adaptés aux dangers identifiés.',
    benefits: [
      'Gants, lunettes, masques adaptés',
      'Type de ventilation recommandé',
      'Conditions de stockage'
    ]
  },
  {
    icon: Database,
    title: 'Sources vérifiées et traçables',
    description: 'Toutes les données proviennent de bases réglementaires officielles avec traçabilité complète.',
    benefits: [
      'PubChem (NIH)',
      'ECHA (Agence européenne)',
      'Score de confiance par donnée'
    ]
  }
];

const securityFeatures = [
  {
    icon: Eye,
    title: 'Aucune conservation des analyses',
    description: 'Vos requêtes chimiques sont traitées en mémoire et immédiatement effacées.'
  },
  {
    icon: Lock,
    title: 'Chiffrement TLS 1.3',
    description: 'Communications sécurisées de bout en bout.'
  },
  {
    icon: Globe,
    title: 'Hébergement européen',
    description: 'Serveurs en UE, conformité RGPD totale.'
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Fonctionnalités complètes pour<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                l'analyse de risques chimiques
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              ChemRisk Pro automatise l'identification des dangers, la génération de tableaux RAMPE 
              et les recommandations de sécurité, tout en respectant les normes HSE les plus strictes.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl">
                Essayer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une plateforme complète pour vos évaluations de risques chimiques professionnelles.
            </p>
          </motion.div>

          <div className="space-y-16">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-2xl aspect-video flex items-center justify-center">
                    <feature.icon className="w-24 h-24 text-slate-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Sécurité et confidentialité
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              ChemRisk Pro a été conçu avec la confidentialité au cœur de son architecture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-slate-800 border border-slate-700 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Prêt à simplifier vos évaluations HSE ?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Essayez ChemRisk Pro gratuitement pendant 7 jours. 
            Aucune carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl">
                Commencer l'essai gratuit
              </Button>
            </Link>
            <Link to={createPageUrl('Pricing')}>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}