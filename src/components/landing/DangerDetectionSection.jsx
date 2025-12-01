import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Package,
  Atom,
  Flame,
  Skull,
  Zap
} from 'lucide-react';

const dangers = [
  {
    icon: Thermometer,
    title: 'Risques d\'exothermie',
    description: 'Détection des réactions runaway et emballements thermiques potentiels',
    example: 'H₂SO₄ + NaOH → Réaction fortement exothermique',
    severity: 'critical',
    color: 'red'
  },
  {
    icon: Skull,
    title: 'Gaz toxiques',
    description: 'Identification des formations de HCl, H₂S, NOx, CO et autres gaz dangereux',
    example: 'Acide + Sulfure → Dégagement H₂S',
    severity: 'high',
    color: 'orange'
  },
  {
    icon: Package,
    title: 'Incompatibilités stockage',
    description: 'Matrice complète acide/oxydant, nitrites/amines, etc.',
    example: 'Ne JAMAIS stocker acides + bases ensemble',
    severity: 'high',
    color: 'yellow'
  },
  {
    icon: Atom,
    title: 'Sous-produits dangereux',
    description: 'Prédiction des produits de décomposition et intermédiaires instables',
    example: 'Peroxydes organiques → Produits instables',
    severity: 'medium',
    color: 'purple'
  },
  {
    icon: Flame,
    title: 'Instabilité thermique',
    description: 'Analyse des températures de décomposition et points d\'éclair',
    example: 'Stockage > 40°C → Risque de décomposition',
    severity: 'high',
    color: 'red'
  },
  {
    icon: Zap,
    title: 'Réactivité explosive',
    description: 'Détection des mélanges potentiellement détonants',
    example: 'Oxydant fort + Réducteur → Risque explosion',
    severity: 'critical',
    color: 'red'
  }
];

const severityColors = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

const iconBgColors = {
  red: 'bg-red-500/10 text-red-500',
  orange: 'bg-orange-500/10 text-orange-500',
  yellow: 'bg-yellow-500/10 text-yellow-500',
  purple: 'bg-purple-500/10 text-purple-500'
};

export default function DangerDetectionSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 font-medium">Détection Intelligente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Dangers invisibles détectés instantanément
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Notre IA identifie les risques que les méthodes traditionnelles ne voient pas. 
            <span className="font-semibold text-slate-900"> Aucun concurrent ne fait ça automatiquement.</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dangers.map((danger, index) => (
            <motion.div
              key={danger.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColors[danger.color]}`}>
                  <danger.icon className="w-6 h-6" />
                </div>
                <Badge className={severityColors[danger.severity]}>
                  {danger.severity === 'critical' ? 'Critique' : 
                   danger.severity === 'high' ? 'Élevé' : 'Modéré'}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {danger.title}
              </h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                {danger.description}
              </p>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-mono text-slate-500">
                  {danger.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '847', label: 'Incompatibilités détectées/mois' },
            { value: '156', label: 'Alertes exothermie' },
            { value: '2,340', label: 'Analyses de réaction' },
            { value: '99.2%', label: 'Précision prédictive' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}