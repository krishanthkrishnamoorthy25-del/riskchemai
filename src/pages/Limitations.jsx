import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, Info, Shield, FileText, 
  CheckCircle2, XCircle, HelpCircle, ArrowRight
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const limitations = [
  {
    category: 'Données & Sources',
    items: [
      {
        limitation: 'Les données proviennent de bases publiques',
        detail: 'PubChem, ECHA, ORD sont nos sources principales. Certaines substances propriétaires ou récentes peuvent ne pas être documentées.',
        severity: 'info'
      },
      {
        limitation: 'Mise à jour non instantanée',
        detail: 'Les bases de données sources sont mises à jour périodiquement. Un décalage de quelques semaines peut exister.',
        severity: 'info'
      },
      {
        limitation: 'Pas d\'accès aux sources payantes',
        detail: 'SciFinder, Reaxys et autres bases payantes ne sont pas accessibles. Le plan Entreprise offre des sources étendues.',
        severity: 'warning'
      }
    ]
  },
  {
    category: 'Analyse IA',
    items: [
      {
        limitation: 'L\'IA peut faire des erreurs',
        detail: 'Comme tout système d\'IA, des erreurs d\'interprétation sont possibles. Le score de confiance indique la fiabilité estimée.',
        severity: 'warning'
      },
      {
        limitation: 'Prédictions, pas certitudes',
        detail: 'Les analyses de réactions et incompatibilités sont des prédictions basées sur des modèles. Elles doivent être validées expérimentalement.',
        severity: 'warning'
      },
      {
        limitation: 'Contexte limité',
        detail: 'L\'IA ne connaît pas votre équipement, vos compétences, ni les conditions exactes de manipulation.',
        severity: 'info'
      }
    ]
  },
  {
    category: 'Usage & Responsabilité',
    items: [
      {
        limitation: 'Document non contractuel',
        detail: 'Les rapports générés sont informatifs et ne remplacent pas les FDS officielles des fournisseurs.',
        severity: 'error'
      },
      {
        limitation: 'Validation expert obligatoire',
        detail: 'Toute manipulation doit être validée par un responsable HSE ou chimiste qualifié.',
        severity: 'error'
      },
      {
        limitation: 'Pas de protocoles de synthèse',
        detail: 'Conformément à la réglementation, aucun protocole détaillé de synthèse n\'est fourni.',
        severity: 'info'
      }
    ]
  },
  {
    category: 'Limites techniques',
    items: [
      {
        limitation: 'Nombre de substances limité',
        detail: 'L\'analyse est optimisée pour 1 à 10 substances. Au-delà, la précision peut diminuer.',
        severity: 'info'
      },
      {
        limitation: 'Mélanges complexes',
        detail: 'Les mélanges de plus de 5 composants peuvent générer des prédictions moins fiables.',
        severity: 'warning'
      },
      {
        limitation: 'Substances exotiques',
        detail: 'Les composés très spécialisés ou récemment découverts peuvent ne pas être reconnus.',
        severity: 'info'
      }
    ]
  }
];

const whatWeDoWell = [
  'Identification rapide des substances par CAS ou nom',
  'Classification GHS et codes H/P fiables',
  'Génération de tableaux RAMPE conformes',
  'Détection des incompatibilités majeures',
  'Recommandations EPI basées sur les FDS',
  'Export PDF/CSV pour documentation',
  'Conformité RGPD (aucune donnée conservée)'
];

const whatWeDontDo = [
  'Remplacer un expert HSE ou chimiste',
  'Fournir des protocoles de synthèse',
  'Garantir l\'exactitude à 100%',
  'Analyser des substances classifiées ou secrètes',
  'Prédire tous les risques possibles',
  'Remplacer les FDS officielles'
];

export default function Limitations() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Transparence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Limites & Avertissements
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ChemRisk AI est un outil d'aide à la décision. Nous croyons en la transparence 
              totale sur ce que nous pouvons et ne pouvons pas faire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Warning */}
      <section className="py-12 bg-red-50 border-y border-red-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">
                Avertissement important
              </h2>
              <p className="text-red-700">
                Les analyses fournies par ChemRisk AI sont générées automatiquement et ont 
                un caractère <strong>purement informatif</strong>. Elles ne constituent pas 
                un avis d'expert et ne remplacent en aucun cas la consultation d'un 
                professionnel qualifié (chimiste, responsable HSE, toxicologue).
              </p>
              <p className="text-red-700 mt-2">
                <strong>Toute manipulation de substances chimiques doit être validée par un 
                responsable sécurité avant exécution.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we do / don't do */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* What we do well */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800">Ce que nous faisons bien</h3>
                </div>
                <ul className="space-y-3">
                  {whatWeDoWell.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What we don't do */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800">Ce que nous ne faisons PAS</h3>
                </div>
                <ul className="space-y-3">
                  {whatWeDontDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Limitations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Limitations détaillées
          </h2>
          
          <div className="space-y-8">
            {limitations.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-lg border ${
                        item.severity === 'error' ? 'bg-red-50 border-red-200' :
                        item.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {item.severity === 'error' ? (
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : item.severity === 'warning' ? (
                          <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            item.severity === 'error' ? 'text-red-800' :
                            item.severity === 'warning' ? 'text-amber-800' :
                            'text-blue-800'
                          }`}>
                            {item.limitation}
                          </p>
                          <p className={`text-sm mt-1 ${
                            item.severity === 'error' ? 'text-red-700' :
                            item.severity === 'warning' ? 'text-amber-700' :
                            'text-blue-700'
                          }`}>
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Bonnes pratiques d'utilisation
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-3">1. Vérifiez toujours</h3>
                <p className="text-slate-600 text-sm">
                  Croisez les informations avec les FDS officielles de vos fournisseurs 
                  et les bases de données de référence (INRS, ECHA).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-3">2. Consultez un expert</h3>
                <p className="text-slate-600 text-sm">
                  En cas de doute ou pour des manipulations à risque, 
                  faites valider par un responsable HSE qualifié.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-3">3. Utilisez le score de confiance</h3>
                <p className="text-slate-600 text-sm">
                  Un score inférieur à 80% indique une incertitude. 
                  Redoublez de vigilance et vérifiez les sources.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-3">4. Signalez les erreurs</h3>
                <p className="text-slate-600 text-sm">
                  Si vous détectez une information incorrecte, 
                  contactez-nous pour améliorer notre système.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Des questions sur nos limites ?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Notre équipe est disponible pour répondre à toutes vos interrogations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                Nous contacter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={createPageUrl('Sources')}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Voir nos sources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}