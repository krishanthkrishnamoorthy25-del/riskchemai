import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  FileCheck, 
  Key,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const securityMeasures = [
  {
    category: 'Protection des données',
    icon: Shield,
    items: [
      {
        title: 'Aucune conservation des analyses',
        description: 'Les requêtes chimiques sont traitées en mémoire et immédiatement supprimées après génération du résultat.'
      },
      {
        title: 'Minimisation des données',
        description: 'Seules les données strictement nécessaires au fonctionnement du service sont collectées.'
      },
      {
        title: 'Logs anonymisés',
        description: 'Les journaux techniques sont anonymisés et ne contiennent aucune information identifiante.'
      }
    ]
  },
  {
    category: 'Chiffrement',
    icon: Lock,
    items: [
      {
        title: 'TLS 1.3',
        description: 'Toutes les communications sont chiffrées avec le protocole TLS 1.3, le plus récent et sécurisé.'
      },
      {
        title: 'Chiffrement au repos',
        description: 'Les données stockées sont chiffrées avec AES-256.'
      },
      {
        title: 'Clés de session',
        description: 'Les sessions utilisateur sont protégées par des tokens JWT à durée limitée.'
      }
    ]
  },
  {
    category: 'Infrastructure',
    icon: Server,
    items: [
      {
        title: 'Hébergement européen',
        description: 'Tous nos serveurs sont localisés en Union Européenne, garantissant la conformité RGPD.'
      },
      {
        title: 'Redondance',
        description: 'Infrastructure haute disponibilité avec réplication des données en temps réel.'
      },
      {
        title: 'Surveillance 24/7',
        description: 'Monitoring continu des systèmes avec alertes automatiques.'
      }
    ]
  },
  {
    category: 'Authentification',
    icon: Key,
    items: [
      {
        title: 'Hashage sécurisé',
        description: 'Les mots de passe sont hashés avec bcrypt, résistant aux attaques par force brute.'
      },
      {
        title: 'Protection anti-brute force',
        description: 'Limitation automatique des tentatives de connexion échouées.'
      },
      {
        title: 'Sessions sécurisées',
        description: 'Expiration automatique des sessions et déconnexion après inactivité.'
      }
    ]
  }
];

const certifications = [
  { name: 'RGPD', description: 'Conformité totale au Règlement Général sur la Protection des Données' },
  { name: 'CNIL', description: 'Respect des recommandations de la Commission Nationale Informatique et Libertés' },
  { name: 'OWASP', description: 'Application des bonnes pratiques de sécurité OWASP' }
];

export default function Security() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Sécurité de niveau entreprise</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Votre sécurité est notre priorité
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              ChemRisk Pro a été conçu avec la sécurité et la confidentialité au cœur de son architecture. 
              Vos données d'analyse ne sont jamais conservées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Point */}
      <section className="py-12 bg-emerald-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 text-white">
            <Eye className="w-8 h-8" />
            <p className="text-xl font-medium">
              Aucune donnée d'analyse chimique n'est jamais stockée sur nos serveurs
            </p>
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Mesures de sécurité
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une approche multicouche pour protéger vos données et garantir la confidentialité.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityMeasures.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{category.category}</h3>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Conformité et certifications
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-slate-400">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Avertissement important
              </h3>
              <p className="text-amber-800">
                ChemRisk Pro est un outil d'aide à l'identification des risques basé sur des données publiques. 
                Toutes les informations fournies doivent être vérifiées par un responsable HSE qualifié. 
                Aucun protocole expérimental n'est fourni. L'utilisation de cet outil ne remplace pas 
                l'expertise d'un professionnel de la sécurité chimique.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}