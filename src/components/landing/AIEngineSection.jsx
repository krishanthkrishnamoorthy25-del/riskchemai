import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  CheckCircle2, 
  Database, 
  Microscope,
  BookOpen,
  Beaker,
  Thermometer,
  ArrowRight
} from 'lucide-react';

const dataSources = [
  { name: 'ECHA CLP', description: 'Substances harmonisées EU', icon: Database },
  { name: 'PubChem NIH', description: 'Structures & propriétés', icon: Microscope },
  { name: 'Bases toxicologiques', description: 'Données DNEL/PNEC', icon: Beaker },
  { name: 'Revues ACS/RSC', description: 'Littérature scientifique', icon: BookOpen },
  { name: 'Compatibilités', description: 'Matrices réactifs/solvants', icon: Thermometer },
];

const verificationSteps = [
  'Extraction des identifiants chimiques (CAS, IUPAC)',
  'Croisement avec bases réglementaires ECHA',
  'Vérification PubChem des propriétés',
  'Analyse des incompatibilités connues',
  'Calcul du score de confiance pondéré'
];

export default function AIEngineSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Moteur IA Prédictif</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Double vérification scientifique
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Notre IA croise automatiquement 5+ sources de données pour garantir 
            des résultats fiables et traçables.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Sources de données croisées</h3>
            {dataSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <source.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{source.name}</p>
                  <p className="text-sm text-slate-400">{source.description}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
              </motion.div>
            ))}
          </motion.div>

          {/* Verification Process */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Processus de vérification</h3>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-400">{index + 1}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-slate-300">{step}</p>
                      {index < verificationSteps.length - 1 && (
                        <div className="w-px h-4 bg-slate-600 ml-4 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="font-medium text-emerald-400">Score de confiance moyen</p>
                    <p className="text-2xl font-bold text-white">94.7%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}