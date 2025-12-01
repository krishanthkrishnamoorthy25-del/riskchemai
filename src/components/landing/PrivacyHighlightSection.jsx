import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Eye,
  Server,
  CheckCircle2,
  Ban,
  Globe
} from 'lucide-react';

const guarantees = [
  {
    icon: Ban,
    title: 'Aucune donnée conservée',
    description: 'Vos analyses chimiques ne sont jamais stockées sur nos serveurs'
  },
  {
    icon: Lock,
    title: 'Chiffrement TLS 1.3',
    description: 'Toutes les communications sont chiffrées de bout en bout'
  },
  {
    icon: Globe,
    title: 'Hébergement EU',
    description: 'Serveurs localisés en Union Européenne uniquement'
  },
  {
    icon: Eye,
    title: 'Zéro tracking',
    description: 'Aucun cookie marketing, aucun profilage utilisateur'
  }
];

export default function PrivacyHighlightSection() {
  return (
    <section className="py-16 bg-emerald-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Safe-by-Design</h3>
                <p className="text-emerald-100">Confidentialité totale garantie</p>
              </div>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Idéal pour les startups en R&D sensible, les labos pharmaceutiques 
              et toute organisation qui ne peut pas risquer de fuite de données.
            </p>
          </motion.div>

          {/* Guarantees */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {guarantees.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-emerald-100">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8"
        >
          {[
            'RGPD Compliant',
            'ISO 27001 Ready',
            'SOC 2 Type II',
            'CNIL Conforme'
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span className="text-white font-medium">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}