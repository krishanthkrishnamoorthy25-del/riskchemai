import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bug, Zap, Shield, FlaskConical } from 'lucide-react';
import Footer from '@/components/landing/Footer';

const releases = [
  {
    version: "2.4.0",
    date: "2 Décembre 2025",
    title: "Propositions théoriques de mécanismes",
    description: "Quand aucune réaction n'est documentée, l'IA propose maintenant des mécanismes plausibles (SN1, SN2, radicalaire, etc.)",
    changes: [
      { type: "feature", text: "Analyse des caractères chimiques (nucléophile, électrophile, base, acide)" },
      { type: "feature", text: "Propositions de mécanismes avec niveau de plausibilité" },
      { type: "feature", text: "Identification des sites réactifs et produits attendus" },
      { type: "improvement", text: "Meilleur affichage des barres d'utilisation RAMPE/Simulations" }
    ]
  },
  {
    version: "2.3.0",
    date: "28 Novembre 2025",
    title: "Nouveaux tarifs & Simulateur amélioré",
    description: "Refonte complète de la grille tarifaire avec options mensuelles/annuelles et simulateur de réactions enrichi.",
    changes: [
      { type: "feature", text: "Offres Étudiant (9,90€), PME (49€) et Entreprise (199€)" },
      { type: "feature", text: "Réduction -20% sur l'abonnement annuel" },
      { type: "feature", text: "Score de provenance des sources scientifiques" },
      { type: "improvement", text: "Analyse des paramètres d'influence (température, pression, catalyseur)" },
      { type: "fix", text: "Correction de l'affichage des produits cinétiques vs thermodynamiques" }
    ]
  },
  {
    version: "2.2.0",
    date: "15 Novembre 2025",
    title: "Filtre anti-abus & Biosécurité",
    description: "Ajout d'un système de détection des requêtes potentiellement dangereuses et module biosécurité.",
    changes: [
      { type: "security", text: "Filtre anti-abus pour bloquer les requêtes de synthèse dangereuse" },
      { type: "feature", text: "Module biosécurité avec évaluation BSL-1 à BSL-4" },
      { type: "feature", text: "Page Sources scientifiques avec liste des bases de données" },
      { type: "improvement", text: "Interface responsive améliorée sur mobile" }
    ]
  },
  {
    version: "2.1.0",
    date: "1 Novembre 2025",
    title: "Mécanismes réactionnels",
    description: "Visualisation des mécanismes réactionnels étape par étape avec flèches et intermédiaires.",
    changes: [
      { type: "feature", text: "Schéma de mécanisme avec étapes numérotées" },
      { type: "feature", text: "Identification de l'étape limitante (RDS)" },
      { type: "feature", text: "Support des mécanismes concertés et par étapes" },
      { type: "fix", text: "Correction des formules moléculaires en indice" }
    ]
  },
  {
    version: "2.0.0",
    date: "15 Octobre 2025",
    title: "Simulateur de réactions v2",
    description: "Refonte majeure du simulateur avec support multi-réactifs et conditions réactionnelles.",
    changes: [
      { type: "feature", text: "Ajout de plusieurs réactifs avec CAS" },
      { type: "feature", text: "Conditions réactionnelles (T°, pression, solvant, catalyseur)" },
      { type: "feature", text: "Prédiction produits majoritaires/minoritaires" },
      { type: "feature", text: "Contrôle cinétique vs thermodynamique" },
      { type: "improvement", text: "Temps de réponse réduit de 40%" }
    ]
  },
  {
    version: "1.5.0",
    date: "1 Octobre 2025",
    title: "Export PDF amélioré",
    description: "Génération de rapports PDF professionnels avec tableaux RAMPE complets.",
    changes: [
      { type: "feature", text: "Export PDF avec logo et en-tête personnalisé" },
      { type: "feature", text: "Tableau RAMPE formaté avec pictogrammes GHS" },
      { type: "improvement", text: "Export CSV avec toutes les colonnes" },
      { type: "fix", text: "Correction encodage caractères spéciaux" }
    ]
  }
];

const getChangeIcon = (type) => {
  switch (type) {
    case 'feature': return <Sparkles className="w-4 h-4 text-emerald-500" />;
    case 'improvement': return <Zap className="w-4 h-4 text-blue-500" />;
    case 'fix': return <Bug className="w-4 h-4 text-amber-500" />;
    case 'security': return <Shield className="w-4 h-4 text-red-500" />;
    default: return <FlaskConical className="w-4 h-4 text-slate-500" />;
  }
};

const getChangeBadge = (type) => {
  switch (type) {
    case 'feature': return <Badge className="bg-emerald-100 text-emerald-700">Nouveau</Badge>;
    case 'improvement': return <Badge className="bg-blue-100 text-blue-700">Amélioration</Badge>;
    case 'fix': return <Badge className="bg-amber-100 text-amber-700">Correction</Badge>;
    case 'security': return <Badge className="bg-red-100 text-red-700">Sécurité</Badge>;
    default: return null;
  }
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 mb-4">Changelog</Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Quoi de neuf ?
            </h1>
            <p className="text-lg text-slate-600">
              Suivez l'évolution de ChemRisk Pro. Nouvelles fonctionnalités, 
              améliorations et corrections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
            
            <div className="space-y-12">
              {releases.map((release, index) => (
                <motion.div
                  key={release.version}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 md:pl-0"
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 mt-2" />
                  
                  {/* Content */}
                  <div className="md:ml-[calc(50%+2rem)]">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">v{release.version}</Badge>
                      <span className="text-sm text-slate-500">{release.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {release.title}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {release.description}
                    </p>
                    
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                      {release.changes.map((change, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {getChangeIcon(change.type)}
                          <span className="text-sm text-slate-700">{change.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}