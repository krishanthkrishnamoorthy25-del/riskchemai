import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  TrendingDown,
  Gauge,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function ChemicalGuardianSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Fonctionnalité Premium</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              AI Chemical Guardian
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                L'outil que les HSE attendent
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Entrez une réaction, l'IA vous dit ce qui peut mal tourner. 
              Elle propose des alternatives plus sûres et calcule un score de criticité 
              basé sur la probabilité × gravité.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: AlertTriangle, text: 'Analyse ce qui peut mal tourner', color: 'text-orange-400' },
                { icon: Lightbulb, text: 'Propose des alternatives plus sûres', color: 'text-yellow-400' },
                { icon: TrendingDown, text: 'Indique comment réduire le risque', color: 'text-emerald-400' },
                { icon: Gauge, text: 'Score de criticité (probabilité × gravité)', color: 'text-purple-400' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-slate-200">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl gap-2 shadow-lg shadow-purple-500/25">
                <Shield className="w-5 h-5" />
                Essayer Chemical Guardian
              </Button>
            </Link>
          </motion.div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white">AI Chemical Guardian</span>
                <Badge className="bg-purple-500/20 text-purple-300 ml-auto">Premium</Badge>
              </div>

              {/* Input */}
              <div className="p-4 bg-slate-900/50 rounded-xl mb-4">
                <p className="text-xs text-slate-400 mb-2">RÉACTION ANALYSÉE</p>
                <p className="text-white font-mono">HNO₃ + CH₃COOH → ?</p>
                <p className="text-xs text-slate-500 mt-1">Acide nitrique + Acide acétique</p>
              </div>

              {/* Criticality Score */}
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <Gauge className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-sm text-red-300">Score de criticité</p>
                    <p className="text-2xl font-bold text-red-400">7.8 / 10</p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400">Élevé</Badge>
              </div>

              {/* Risks */}
              <div className="space-y-3 mb-4">
                <p className="text-xs font-medium text-slate-400">⚠️ RISQUES IDENTIFIÉS</p>
                {[
                  { risk: 'Formation de vapeurs nitrées toxiques (NOx)', severity: 'high' },
                  { risk: 'Réaction exothermique potentielle', severity: 'medium' },
                  { risk: 'Risque d\'emballement thermique', severity: 'high' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <XCircle className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-400' : 'text-orange-400'}`} />
                    <span className="text-slate-300">{item.risk}</span>
                  </div>
                ))}
              </div>

              {/* Alternatives */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs font-medium text-emerald-400 mb-2">💡 ALTERNATIVE SUGGÉRÉE</p>
                <p className="text-sm text-emerald-300">
                  Utiliser l'acide citrique pour les applications de nettoyage, 
                  ou procéder sous hotte avec refroidissement.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Réduction du risque: -65%</span>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}