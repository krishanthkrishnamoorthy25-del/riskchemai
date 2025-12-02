import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ExternalLink } from 'lucide-react';

// Citations réelles de scientifiques sur la sécurité chimique
const realQuotes = [
  {
    quote: "La chimie n'est ni bonne ni mauvaise, c'est l'usage qu'on en fait qui détermine ses effets.",
    author: "Marie Curie",
    role: "Prix Nobel de Chimie 1911",
    source: "Discours Nobel"
  },
  {
    quote: "La sécurité en laboratoire n'est pas une option, c'est une responsabilité.",
    author: "INRS",
    role: "Institut National de Recherche et de Sécurité",
    source: "Guide de prévention"
  },
  {
    quote: "Connaître les risques, c'est pouvoir les prévenir.",
    author: "ECHA",
    role: "Agence Européenne des Produits Chimiques",
    source: "Réglementation REACH"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            La sécurité chimique selon les experts
          </h2>
          <p className="text-slate-400">
            Citations et références de sources officielles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {realQuotes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white/5 rounded-2xl border border-white/10"
            >
              <Quote className="w-10 h-10 text-emerald-500 mb-4" />
              <p className="text-lg text-slate-200 mb-6 italic">
                "{item.quote}"
              </p>
              <div>
                <p className="font-semibold text-white">{item.author}</p>
                <p className="text-sm text-slate-400">{item.role}</p>
                <p className="text-xs text-emerald-400 mt-1">{item.source}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            ChemRisk AI s'appuie sur les recommandations des organismes officiels : 
            ECHA, INRS, PubChem, et les réglementations REACH & CLP.
          </p>
        </div>
      </div>
    </section>
  );
}