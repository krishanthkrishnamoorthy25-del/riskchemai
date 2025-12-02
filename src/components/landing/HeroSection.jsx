import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Shield, Zap, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Conforme RGPD • Données non conservées</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Analyse de risques
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                chimiques par IA
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Générez instantanément vos tableaux RAMPE, identifiez les dangers GHS, 
              codes H/P et recommandations EPI. Conforme aux normes HSE européennes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25">
                  Essai gratuit 7 jours
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Features')}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl">
                  Voir les fonctionnalités
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Gain de temps', value: '90%', desc: 'vs analyse manuelle' },
                { label: 'Sources vérifiées', value: '100%', desc: 'PubChem & ECHA' },
                { label: 'Analyse express', value: '< 10s', desc: 'par substance' }
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-400 text-sm ml-4">Analyse RAMPE</span>
                </div>

                {/* Sample Analysis Result */}
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Acide sulfurique</span>
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Danger</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">CAS:</span>
                        <span className="text-slate-200 ml-2">7664-93-9</span>
                      </div>
                      <div>
                        <span className="text-slate-400">GHS:</span>
                        <span className="text-slate-200 ml-2">GHS05, GHS07</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">H314</span>
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">H290</span>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">P280</span>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">P305+P351</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Score de confiance: 98%</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-emerald-500 rounded-xl p-4 shadow-lg shadow-emerald-500/30"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-blue-500 rounded-xl p-4 shadow-lg shadow-blue-500/30"
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}