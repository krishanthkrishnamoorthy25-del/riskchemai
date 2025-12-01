import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Scale, 
  Ban,
  FileWarning,
  UserCheck,
  Gavel,
  Info
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const sections = [
  {
    icon: AlertTriangle,
    title: 'Nature du service',
    color: 'amber',
    content: `ChemRisk Pro est un outil d'aide à la décision qui fournit des pré-évaluations automatisées 
    basées sur des données publiques et des algorithmes d'intelligence artificielle. 
    
    Ce service ne remplace EN AUCUN CAS :
    • L'expertise d'un ingénieur HSE qualifié
    • Une évaluation des risques professionnelle
    • Les obligations légales de l'employeur
    • Une formation à la sécurité chimique`
  },
  {
    icon: UserCheck,
    title: 'Responsabilité de l\'utilisateur',
    color: 'blue',
    content: `L'utilisateur reconnaît et accepte que :
    
    • Toute analyse doit être validée par un professionnel qualifié avant application
    • Les résultats sont indicatifs et peuvent contenir des inexactitudes
    • L'utilisateur reste seul responsable des décisions prises
    • Les manipulations chimiques doivent respecter la réglementation en vigueur
    • Un score de confiance élevé ne garantit pas l'exactitude absolue`
  },
  {
    icon: Ban,
    title: 'Utilisations interdites',
    color: 'red',
    content: `Il est STRICTEMENT INTERDIT d'utiliser ChemRisk Pro pour :
    
    • La fabrication ou synthèse de substances illicites
    • La création d'explosifs ou d'engins incendiaires
    • Le développement d'armes chimiques ou biologiques
    • Toute activité illégale ou dangereuse pour autrui
    • Contourner les mesures de sécurité ou réglementations
    
    Toute utilisation suspecte sera signalée aux autorités compétentes.`
  },
  {
    icon: Shield,
    title: 'Limitation de responsabilité',
    color: 'slate',
    content: `ChemRisk Pro et ses créateurs déclinent toute responsabilité pour :
    
    • Les dommages directs ou indirects résultant de l'utilisation du service
    • Les erreurs ou omissions dans les données fournies
    • Les décisions prises sur la base des analyses générées
    • Les accidents ou incidents liés à des manipulations chimiques
    • L'indisponibilité temporaire du service
    
    L'utilisation du service implique l'acceptation de ces limitations.`
  },
  {
    icon: Scale,
    title: 'Conformité réglementaire',
    color: 'purple',
    content: `ChemRisk Pro s'efforce de respecter les réglementations en vigueur :
    
    • Règlement REACH (CE n° 1907/2006)
    • Règlement CLP (CE n° 1272/2008)
    • Système GHS des Nations Unies
    • Code du travail (articles R. 4412-1 et suivants)
    
    Cependant, l'utilisateur doit vérifier la conformité avec les réglementations 
    spécifiques à son secteur et sa juridiction.`
  },
  {
    icon: FileWarning,
    title: 'Données et sources',
    color: 'emerald',
    content: `Les analyses sont basées sur des données provenant de sources publiques :
    
    • PubChem (NIH/NCBI)
    • ECHA (European Chemicals Agency)
    • Classification GHS (ONU)
    • EPA CompTox
    • CAMEO Chemicals (NOAA)
    
    Ces données peuvent être incomplètes, obsolètes ou contenir des erreurs.
    Le score de confiance indique le niveau de fiabilité estimé.`
  }
];

const colorClasses = {
  amber: 'bg-amber-50 border-amber-200 text-amber-600',
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  red: 'bg-red-50 border-red-200 text-red-600',
  slate: 'bg-slate-50 border-slate-200 text-slate-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600'
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <Gavel className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Limites et avertissements légaux
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Veuillez lire attentivement ces informations avant d'utiliser ChemRisk Pro. 
              L'utilisation du service implique l'acceptation de ces conditions.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Dernière mise à jour : 1er décembre 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Warning */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-3">
                  AVERTISSEMENT IMPORTANT
                </h2>
                <p className="text-red-800 font-medium">
                  Cet outil fournit une pré-évaluation automatisée basée sur des données publiques. 
                  Une validation par un responsable sécurité ou un expert HSE qualifié est 
                  OBLIGATOIRE avant toute expérimentation ou manipulation chimique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${colorClasses[section.color]}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
              </div>
              <div className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Questions ou signalements</h3>
              <p className="text-slate-600 text-sm mb-4">
                Pour toute question concernant ces avertissements ou pour signaler une utilisation 
                abusive, contactez notre équipe de conformité.
              </p>
              <p className="text-sm">
                <span className="font-medium">Email :</span>{' '}
                <a href="mailto:legal@chemriskpro.eu" className="text-blue-600 hover:underline">
                  legal@chemriskpro.eu
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance */}
      <section className="py-8 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 text-sm">
            En utilisant ChemRisk Pro, vous reconnaissez avoir lu, compris et accepté 
            l'ensemble de ces avertissements et limitations.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}