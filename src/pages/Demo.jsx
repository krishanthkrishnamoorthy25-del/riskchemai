import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, FlaskConical, Shield, FileText, Zap,
  CheckCircle2, Clock, ArrowRight, Eye
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const demoSteps = [
  {
    step: 1,
    title: 'Saisie des substances',
    description: 'Entrez le nom, le numéro CAS ou la formule de vos substances chimiques.',
    image: '🧪',
    features: ['Auto-complétion intelligente', 'Recherche par CAS', 'Import par lot']
  },
  {
    step: 2,
    title: 'Analyse IA instantanée',
    description: 'Notre moteur IA interroge PubChem, ECHA et nos bases propriétaires.',
    image: '🤖',
    features: ['30 secondes max', 'Sources vérifiées', 'Score de confiance']
  },
  {
    step: 3,
    title: 'Résultats détaillés',
    description: 'Recevez un rapport complet avec tableau RAMPE, EPI, stockage et incompatibilités.',
    image: '📊',
    features: ['Tableau RAMPE', 'Pictogrammes GHS', 'Codes H & P']
  },
  {
    step: 4,
    title: 'Export & Partage',
    description: 'Exportez en PDF ou CSV pour vos dossiers de sécurité et audits.',
    image: '📄',
    features: ['Export PDF', 'Export CSV', 'Impression directe']
  }
];

const exampleAnalysis = {
  substance: 'Acide sulfurique',
  cas: '7664-93-9',
  formula: 'H₂SO₄',
  ghs: ['GHS05', 'GHS07'],
  hCodes: ['H314: Provoque des brûlures de la peau et des lésions oculaires graves', 'H290: Peut être corrosif pour les métaux'],
  pCodes: ['P280: Porter des gants/vêtements de protection', 'P305+P351+P338: EN CAS DE CONTACT AVEC LES YEUX: rincer'],
  epi: 'Lunettes de protection, gants nitrile, blouse de laboratoire',
  stockage: 'Armoire ventilée pour acides, bac de rétention',
  confidence: 98
};

export default function Demo() {
  const [activeStep, setActiveStep] = useState(1);
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-6">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Démonstration</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Découvrez ChemRisk AI en action
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Une analyse de risques chimiques complète en moins de 30 secondes. 
                Voyez par vous-même comment notre IA révolutionne la sécurité en laboratoire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('Dashboard')}>
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <Zap className="w-5 h-5" />
                    Essayer maintenant
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowExample(!showExample)}
                  className="gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Voir un exemple
                </Button>
              </div>
            </motion.div>

            {/* Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <p className="text-xl font-semibold">Vidéo de démonstration</p>
                  <p className="text-indigo-200">2 minutes pour tout comprendre</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Durée : 2:30</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example Analysis */}
      {showExample && (
        <motion.section 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="py-12 bg-slate-50"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Exemple d'analyse : {exampleAnalysis.substance}
            </h2>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Identification */}
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-indigo-600" />
                      Identification
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-500">Nom :</span> <strong>{exampleAnalysis.substance}</strong></p>
                      <p><span className="text-slate-500">CAS :</span> <code className="bg-slate-100 px-2 py-0.5 rounded">{exampleAnalysis.cas}</code></p>
                      <p><span className="text-slate-500">Formule :</span> <span className="font-mono">{exampleAnalysis.formula}</span></p>
                    </div>
                    
                    <h3 className="font-semibold text-slate-700 mt-6 mb-4">Pictogrammes GHS</h3>
                    <div className="flex gap-2">
                      {exampleAnalysis.ghs.map(g => (
                        <Badge key={g} className="bg-red-100 text-red-700">{g}</Badge>
                      ))}
                    </div>

                    <h3 className="font-semibold text-slate-700 mt-6 mb-4">Score de confiance</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${exampleAnalysis.confidence}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-600">{exampleAnalysis.confidence}%</span>
                    </div>
                  </div>

                  {/* Dangers & Protections */}
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Dangers
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {exampleAnalysis.hCodes.map((h, i) => (
                        <li key={i} className="text-red-700 bg-red-50 p-2 rounded">{h}</li>
                      ))}
                    </ul>

                    <h3 className="font-semibold text-slate-700 mt-6 mb-4">Protections</h3>
                    <ul className="space-y-2 text-sm">
                      {exampleAnalysis.pCodes.map((p, i) => (
                        <li key={i} className="text-blue-700 bg-blue-50 p-2 rounded">{p}</li>
                      ))}
                    </ul>

                    <h3 className="font-semibold text-slate-700 mt-6 mb-2">EPI requis</h3>
                    <p className="text-sm text-slate-600 bg-emerald-50 p-2 rounded">{exampleAnalysis.epi}</p>

                    <h3 className="font-semibold text-slate-700 mt-4 mb-2">Stockage</h3>
                    <p className="text-sm text-slate-600 bg-amber-50 p-2 rounded">{exampleAnalysis.stockage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      )}

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-slate-600">4 étapes simples pour une analyse complète</p>
          </div>

          {/* Steps Navigation */}
          <div className="flex justify-center gap-4 mb-12">
            {demoSteps.map((step) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  activeStep === step.step 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="font-bold">{step.step}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="text-center lg:text-left">
              <div className="text-6xl mb-6">{demoSteps[activeStep - 1].image}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Étape {activeStep}: {demoSteps[activeStep - 1].title}
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                {demoSteps[activeStep - 1].description}
              </p>
              <ul className="space-y-3">
                {demoSteps[activeStep - 1].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-2xl aspect-video flex items-center justify-center">
              <p className="text-slate-400">Capture d'écran étape {activeStep}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Summary */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ultra rapide</h3>
                <p className="text-slate-600">Résultats complets en moins de 30 secondes</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">100% sécurisé</h3>
                <p className="text-slate-600">Aucune donnée conservée, conforme RGPD</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export facile</h3>
                <p className="text-slate-600">PDF, CSV, impression pour vos dossiers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Prêt à essayer ?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            7 jours d'essai gratuit, sans carte bancaire. 
            Accédez à toutes les fonctionnalités immédiatement.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg gap-2">
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}