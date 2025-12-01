import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  ExternalLink, 
  Shield, 
  CheckCircle2,
  Globe,
  BookOpen,
  Beaker,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/landing/Footer';

const primarySources = [
  {
    name: 'PubChem',
    organization: 'NIH / NCBI',
    url: 'https://pubchem.ncbi.nlm.nih.gov',
    description: 'Base de données de référence mondiale pour les structures chimiques, propriétés et données de sécurité.',
    dataTypes: ['Structures moléculaires', 'Propriétés physico-chimiques', 'Classification GHS', 'Toxicité'],
    status: 'Obligatoire',
    logo: '🧬'
  },
  {
    name: 'ECHA',
    organization: 'European Chemicals Agency',
    url: 'https://echa.europa.eu',
    description: 'Agence européenne des produits chimiques. Source officielle pour la réglementation REACH et CLP.',
    dataTypes: ['Classification CLP', 'Fiches de sécurité', 'Restrictions REACH', 'Données toxicologiques'],
    status: 'Obligatoire',
    logo: '🇪🇺'
  },
  {
    name: 'GHS Classification',
    organization: 'Nations Unies',
    url: 'https://unece.org/transport/dangerous-goods/ghs-rev10-2023',
    description: 'Système général harmonisé de classification et d\'étiquetage des produits chimiques.',
    dataTypes: ['Pictogrammes', 'Codes H et P', 'Classes de danger', 'Catégories'],
    status: 'Obligatoire',
    logo: '🌐'
  },
  {
    name: 'EPA CompTox',
    organization: 'US Environmental Protection Agency',
    url: 'https://comptox.epa.gov',
    description: 'Données de chimie computationnelle et toxicologie prédictive de l\'EPA américaine.',
    dataTypes: ['Données toxicologiques', 'Propriétés prédites', 'Données environnementales'],
    status: 'Obligatoire',
    logo: '🔬'
  },
  {
    name: 'CAMEO Chemicals',
    organization: 'NOAA',
    url: 'https://cameochemicals.noaa.gov',
    description: 'Base de données sur les interactions dangereuses et la réactivité chimique.',
    dataTypes: ['Incompatibilités', 'Réactivité', 'Interventions d\'urgence'],
    status: 'Obligatoire',
    logo: '⚗️'
  },
  {
    name: 'NIST Chemistry WebBook',
    organization: 'National Institute of Standards and Technology',
    url: 'https://webbook.nist.gov/chemistry/',
    description: 'Données thermodynamiques et spectroscopiques de référence.',
    dataTypes: ['Données thermodynamiques', 'Spectres', 'Constantes physiques'],
    status: 'Obligatoire',
    logo: '📊'
  }
];

const secondarySources = [
  {
    name: 'Open Reaction Database (ORD)',
    url: 'https://open-reaction-database.org',
    description: 'Base de données ouverte de réactions chimiques documentées.',
    status: 'Complémentaire'
  },
  {
    name: 'CAS Common Chemistry',
    url: 'https://commonchemistry.cas.org',
    description: 'Accès gratuit aux informations de base sur les substances chimiques.',
    status: 'Complémentaire'
  },
  {
    name: 'Europe PMC',
    url: 'https://europepmc.org',
    description: 'Publications scientifiques en libre accès.',
    status: 'Complémentaire'
  }
];

export default function Sources() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Sources scientifiques
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              ChemRisk Pro utilise exclusivement des bases de données publiques, 
              officielles et scientifiquement validées pour garantir la fiabilité des analyses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Données vérifiées</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-600">Sources officielles</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-slate-600">Open data</span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-slate-600">Peer-reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Sources */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Sources principales
          </h2>
          <div className="space-y-6">
            {primarySources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{source.logo}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{source.name}</h3>
                      <p className="text-sm text-slate-500">{source.organization}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">{source.status}</Badge>
                </div>
                <p className="text-slate-600 mb-4">{source.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {source.dataTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Visiter {source.name} <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Sources */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Sources complémentaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {secondarySources.map((source) => (
              <div key={source.name} className="p-5 bg-white rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{source.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{source.description}</p>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  Accéder <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Méthodologie d'analyse
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <Beaker className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Croisement des sources</h3>
              <p className="text-slate-600 text-sm">
                Chaque substance est vérifiée dans plusieurs bases de données pour garantir 
                l'exactitude des informations. Le score de confiance reflète la concordance des sources.
              </p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Validation continue</h3>
              <p className="text-slate-600 text-sm">
                Les données sont régulièrement mises à jour selon les publications officielles 
                et les évolutions réglementaires (REACH, CLP, GHS).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Avertissement important</h3>
              <p className="text-amber-800 text-sm">
                Les analyses fournies par ChemRisk Pro sont des pré-évaluations basées sur des données publiques. 
                Elles ne remplacent pas l'expertise d'un professionnel HSE qualifié. 
                Toute manipulation chimique doit être validée par un responsable sécurité compétent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}