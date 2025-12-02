import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Marie Dubois",
    role: "Responsable HSE",
    company: "Laboratoire Pharma Lyon",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "ChemRisk Pro a révolutionné notre gestion des risques chimiques. En 2 minutes, nous avons un tableau RAMPE complet là où il nous fallait 2 heures.",
    rating: 5
  },
  {
    name: "Prof. Jean-Pierre Martin",
    role: "Directeur de laboratoire",
    company: "Université de Strasbourg",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "Outil indispensable pour nos TP de chimie. Les étudiants comprennent enfin les risques grâce aux pictogrammes et codes H/P clairs.",
    rating: 5
  },
  {
    name: "Sophie Leroy",
    role: "Ingénieure Sécurité",
    company: "ChemIndus Group",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Le score de confiance IA et les sources vérifiables nous permettent de valider rapidement les analyses. Gain de temps énorme.",
    rating: 5
  },
  {
    name: "Thomas Bernard",
    role: "Technicien de laboratoire",
    company: "BioTech Solutions",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Interface intuitive et résultats précis. Le simulateur de réactions est un vrai plus pour anticiper les risques.",
    rating: 5
  }
];

const logos = [
  { name: "CNRS", src: "https://upload.wikimedia.org/wikipedia/fr/thumb/8/8e/Centre_national_de_la_recherche_scientifique.svg/120px-Centre_national_de_la_recherche_scientifique.svg.png" },
  { name: "INRS", text: "INRS" },
  { name: "CEA", text: "CEA" },
  { name: "Sorbonne", text: "Sorbonne" },
  { name: "INSERM", text: "INSERM" },
  { name: "Pasteur", text: "Institut Pasteur" }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-slate-500 mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center">
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} className="h-10 object-contain" />
                ) : (
                  <span className="text-xl font-bold text-slate-400">{logo.text}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Plus de 500 professionnels utilisent ChemRisk Pro quotidiennement
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-200" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}