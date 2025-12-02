import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FlaskConical, GraduationCap, Building2, Factory,
  Beaker, Shield, FileText, Clock, Users, CheckCircle2,
  ArrowRight, Quote
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const useCases = [
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Éducation & Recherche',
    subtitle: 'Universités, Écoles d\'ingénieurs, Laboratoires universitaires',
    color: 'from-blue-500 to-indigo-600',
    description: 'Formez vos étudiants à la sécurité chimique avec un outil moderne et accessible.',
    benefits: [
      'Analyse instantanée des TP et manipulations',
      'Tableaux RAMPE auto-générés',
      'Sensibilisation aux codes GHS',
      'Tarif éducation avantageux'
    ],
    testimonial: {
      quote: 'ChemRisk AI a révolutionné nos TP de chimie organique. Les étudiants comprennent enfin l\'importance des EPI.',
      author: 'Dr. Marie Dupont',
      role: 'Maître de conférences, Université de Lyon'
    },
    stats: [
      { value: '85%', label: 'Gain de temps sur la préparation TP' },
      { value: '100%', label: 'Conformité tableaux RAMPE' }
    ]
  },
  {
    id: 'pme',
    icon: Building2,
    title: 'PME & Artisans',
    subtitle: 'Ateliers, Laboratoires privés, Artisans chimistes',
    color: 'from-emerald-500 to-teal-600',
    description: 'Sécurisez vos manipulations sans expert HSE à temps plein.',
    benefits: [
      'Conformité réglementaire simplifiée',
      'Pas besoin d\'expertise HSE interne',
      'Génération de documents obligatoires',
      'ROI immédiat sur la prévention'
    ],
    testimonial: {
      quote: 'En tant que petit laboratoire cosmétique, nous n\'avions pas les moyens d\'un expert HSE. ChemRisk AI comble ce besoin.',
      author: 'Jean-Pierre Martin',
      role: 'Fondateur, Cosmétiques Naturels du Sud'
    },
    stats: [
      { value: '10x', label: 'Moins cher qu\'un consultant HSE' },
      { value: '0', label: 'Accident depuis l\'adoption' }
    ]
  },
  {
    id: 'industrie',
    icon: Factory,
    title: 'Industrie Chimique',
    subtitle: 'BASF, Arkema, Solvay, Groupe chimique',
    color: 'from-purple-500 to-pink-600',
    description: 'Standardisez l\'analyse de risques à l\'échelle de votre groupe.',
    benefits: [
      'Multi-sites, multi-utilisateurs',
      'Intégration API à vos systèmes',
      'Traçabilité et audit',
      'SLA garanti 99,9%'
    ],
    testimonial: {
      quote: 'ChemRisk AI s\'intègre parfaitement à notre LIMS. L\'API est robuste et bien documentée.',
      author: 'Sophie Bernard',
      role: 'Responsable HSE, Groupe Chimique International'
    },
    stats: [
      { value: '50+', label: 'Sites déployés' },
      { value: '99.9%', label: 'Disponibilité garantie' }
    ]
  },
  {
    id: 'pharma',
    icon: Beaker,
    title: 'Pharmacie & Biotechnologie',
    subtitle: 'Laboratoires pharmaceutiques, Biotech, CRO',
    color: 'from-orange-500 to-red-600',
    description: 'Analysez les risques de vos synthèses et procédés biotechnologiques.',
    benefits: [
      'Analyse réactions multi-étapes',
      'Module biosécurité BSL-1 à BSL-3',
      'Compatibilité avec les GMP',
      'Données non conservées (RGPD)'
    ],
    testimonial: {
      quote: 'Le module biosécurité est particulièrement pertinent pour nos cultures cellulaires. Gain de temps considérable.',
      author: 'Dr. Antoine Lefèvre',
      role: 'Directeur R&D, BioTech Innovations'
    },
    stats: [
      { value: '200+', label: 'Analyses biosécurité/mois' },
      { value: '100%', label: 'Conformité RGPD' }
    ]
  }
];

const features = [
  { icon: Clock, title: 'Analyse en 30 secondes', description: 'Résultats instantanés vs heures de recherche manuelle' },
  { icon: FileText, title: 'Documents auto-générés', description: 'RAMPE, FDS simplifiée, guide de manipulation' },
  { icon: Shield, title: 'Données sécurisées', description: 'Aucune conservation des analyses, RGPD compliant' },
  { icon: Users, title: 'Multi-utilisateurs', description: 'Gestion des équipes et des droits d\'accès' }
];

export default function UseCases() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Cas d'usage
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez comment ChemRisk AI accompagne les professionnels de la chimie, 
              de l'éducation à l'industrie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${useCase.color} text-white mb-4`}>
                  <useCase.icon className="w-5 h-5" />
                  <span className="font-medium">{useCase.title}</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{useCase.subtitle}</h2>
                <p className="text-lg text-slate-600 mb-6">{useCase.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="flex gap-8 mb-8">
                  {useCase.stats.map((stat, i) => (
                    <div key={i}>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${useCase.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Link to={createPageUrl('Dashboard')}>
                  <Button className={`bg-gradient-to-r ${useCase.color} text-white gap-2`}>
                    Essayer gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Testimonial Card */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <Quote className={`w-10 h-10 mb-4 bg-gradient-to-r ${useCase.color} bg-clip-text text-transparent opacity-50`} />
                    <p className="text-lg text-slate-700 italic mb-6">
                      "{useCase.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${useCase.color} flex items-center justify-center text-white font-bold`}>
                        {useCase.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{useCase.testimonial.author}</p>
                        <p className="text-sm text-slate-500">{useCase.testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Pourquoi choisir ChemRisk AI ?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-sm"
              >
                <feature.icon className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Prêt à sécuriser vos manipulations ?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Rejoignez les centaines de professionnels qui font confiance à ChemRisk AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                Démarrer l'essai gratuit
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="px-8">
                Contacter les ventes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}