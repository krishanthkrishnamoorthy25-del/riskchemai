import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Trash2, Server, FileCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: Eye,
    title: 'Aucune conservation des analyses',
    description: 'Vos requêtes chimiques ne sont jamais stockées. Les données sont traitées en mémoire et immédiatement supprimées.'
  },
  {
    icon: Lock,
    title: 'Chiffrement de bout en bout',
    description: 'Toutes les communications sont protégées par TLS 1.3. Vos données sont chiffrées au repos et en transit.'
  },
  {
    icon: Trash2,
    title: 'Droit à l\'effacement',
    description: 'Supprimez votre compte et toutes vos données en un clic. Exécution garantie sous 30 jours.'
  },
  {
    icon: Server,
    title: 'Hébergement européen',
    description: 'Serveurs localisés en UE. Conformité totale avec le RGPD et les réglementations européennes.'
  },
  {
    icon: FileCheck,
    title: 'Logs anonymisés',
    description: 'Seuls les logs techniques anonymisés sont conservés pour la maintenance de la plateforme.'
  },
  {
    icon: Shield,
    title: 'Conformité RGPD',
    description: 'Architecture conçue dès le départ pour respecter les principes de minimisation des données.'
  }
];

export default function SecuritySection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Sécurité & Confidentialité</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Vos données sont sacrées
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            ChemRisk Pro a été conçu avec la confidentialité au cœur de son architecture. 
            Nous ne stockons jamais vos analyses chimiques.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-slate-700 text-center"
        >
          <p className="text-slate-300 text-lg">
            <strong className="text-white">Important :</strong> ChemRisk Pro est un outil d'aide à l'identification des risques. 
            Toutes les informations doivent être vérifiées par un responsable HSE qualifié.
          </p>
        </motion.div>
      </div>
    </section>
  );
}