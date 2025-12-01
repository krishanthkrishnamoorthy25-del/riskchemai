import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Shield,
  BookOpen,
  Lightbulb,
  Award,
  ArrowRight
} from 'lucide-react';

const packContents = [
  { icon: FileText, text: 'Tableau RAMPE / HASP complet' },
  { icon: Shield, text: 'Pictogrammes GHS officiels' },
  { icon: Award, text: 'Codes H & P + phrases EUH' },
  { icon: CheckCircle2, text: 'Recommandations EPI détaillées' },
  { icon: BookOpen, text: 'Conditions thermiques & ventilation' },
  { icon: Lightbulb, text: 'Alternatives plus sûres (suggestions IA)' },
  { icon: Award, text: 'Score de confiance avec sources' },
  { icon: BookOpen, text: 'Bibliographie automatique' }
];

export default function SafetyPackSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-600 font-medium">Safety Pack Pro</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Documentation réglementaire
              <span className="block text-emerald-600">générée en 1 clic</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Créez instantanément un PDF certifiable contenant toutes les informations 
              requises par les réglementations HSE européennes. Plus besoin de compiler 
              manuellement vos documents.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {packContents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2">
                Générer un Safety Pack
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* PDF Preview Card */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Safety Pack Pro</p>
                    <p className="text-xs text-slate-500">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 ml-auto" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 mb-1">SUBSTANCES</p>
                    <p className="text-sm text-slate-700">Acide sulfurique (H₂SO₄), Hydroxyde de sodium (NaOH)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs font-medium text-red-500 mb-1">DANGER</p>
                      <div className="flex gap-1">
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">H314</span>
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">H290</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-500 mb-1">PRUDENCE</p>
                      <div className="flex gap-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">P280</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">P310</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-xs font-medium text-emerald-600 mb-1">EPI REQUIS</p>
                    <p className="text-xs text-emerald-700">Lunettes, gants nitrile, blouse, sorbonne</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs font-medium text-purple-600 mb-1">💡 ALTERNATIVE SUGGÉRÉE</p>
                    <p className="text-xs text-purple-700">Utiliser acide citrique pour applications non critiques</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-slate-500">Confiance: 96%</span>
                  </div>
                  <span className="text-xs text-slate-400">Sources: ECHA, PubChem</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}