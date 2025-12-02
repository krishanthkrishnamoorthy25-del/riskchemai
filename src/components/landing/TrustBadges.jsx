import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Lock, FileCheck, Globe, Clock } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: "Conforme RGPD",
    description: "Données non conservées",
    color: "emerald"
  },
  {
    icon: Server,
    title: "Hébergé en France",
    description: "Serveurs OVH certifiés",
    color: "blue"
  },
  {
    icon: Lock,
    title: "Chiffrement TLS 1.3",
    description: "Données sécurisées",
    color: "purple"
  },
  {
    icon: FileCheck,
    title: "Sources vérifiées",
    description: "PubChem, ECHA, INRS",
    color: "amber"
  },
  {
    icon: Globe,
    title: "99.9% Uptime",
    description: "SLA garanti",
    color: "cyan"
  },
  {
    icon: Clock,
    title: "Support réactif",
    description: "< 24h réponse",
    color: "rose"
  }
];

const colorClasses = {
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200"
};

export default function TrustBadges({ variant = "full" }) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {badges.slice(0, 4).map((badge) => (
          <div 
            key={badge.title}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colorClasses[badge.color]}`}
          >
            <badge.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Sécurité & Conformité
          </h2>
          <p className="text-slate-600">
            Une plateforme conçue pour les exigences professionnelles
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col items-center text-center p-4 rounded-xl border ${colorClasses[badge.color]}`}
            >
              <badge.icon className="w-8 h-8 mb-2" />
              <p className="font-semibold text-sm text-slate-900">{badge.title}</p>
              <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}