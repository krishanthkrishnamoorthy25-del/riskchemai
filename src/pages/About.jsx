import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  Shield, 
  Users, 
  Target, 
  Award,
  Linkedin,
  Mail,
  ArrowRight
} from 'lucide-react';
import Footer from '@/components/landing/Footer';

const team = [
  {
    name: "Dr. Alexandre Martin",
    role: "Fondateur & CEO",
    bio: "Docteur en chimie, 15 ans d'expérience HSE en industrie chimique. Passionné par la démocratisation de la sécurité chimique.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    linkedin: "#"
  },
  {
    name: "Marie Lefevre",
    role: "CTO",
    bio: "Ingénieure en intelligence artificielle, experte en traitement de données scientifiques et NLP appliqué à la chimie.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    linkedin: "#"
  },
  {
    name: "Thomas Dubois",
    role: "Head of Product",
    bio: "10 ans d'expérience en développement de SaaS B2B. Ancien consultant HSE chez un grand groupe industriel.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    linkedin: "#"
  }
];

const values = [
  {
    icon: Shield,
    title: "Sécurité avant tout",
    description: "La protection des personnes et de l'environnement guide chacune de nos décisions produit."
  },
  {
    icon: Target,
    title: "Accessibilité",
    description: "Rendre l'analyse de risques chimiques accessible à tous, de l'étudiant à l'industriel."
  },
  {
    icon: Award,
    title: "Excellence scientifique",
    description: "Données vérifiées, sources citées, score de confiance. La rigueur scientifique est notre ADN."
  },
  {
    icon: Users,
    title: "Écoute utilisateurs",
    description: "Notre roadmap est guidée par vos retours. Chaque fonctionnalité répond à un besoin réel."
  }
];

const milestones = [
  { year: "2022", event: "Idée initiale née d'un besoin terrain en laboratoire" },
  { year: "2023", event: "Développement du prototype IA avec intégration PubChem" },
  { year: "2024", event: "Lancement beta avec 50 utilisateurs pilotes" },
  { year: "2025", event: "Lancement commercial et 2 500+ utilisateurs actifs" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-8">
              <FlaskConical className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Notre mission : démocratiser<br />la sécurité chimique
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ChemRisk Pro est né d'un constat simple : l'analyse de risques chimiques 
              ne devrait pas être réservée aux grandes entreprises avec des budgets conséquents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Notre histoire</h2>
            <p className="text-slate-600 leading-relaxed">
              Tout a commencé dans un laboratoire universitaire, où notre fondateur passait des heures 
              à rechercher manuellement les fiches de données de sécurité sur différents sites, 
              à croiser les informations, à remplir des tableaux RAMPE à la main.
            </p>
            <p className="text-slate-600 leading-relaxed">
              La question était simple : <strong>"Pourquoi est-ce si compliqué d'avoir une vue claire 
              des risques chimiques en 2024 ?"</strong> Les outils existants étaient soit trop chers, 
              soit trop complexes, soit pas assez fiables.
            </p>
            <p className="text-slate-600 leading-relaxed">
              ChemRisk Pro est la réponse : une plateforme moderne, alimentée par l'IA, 
              qui interroge les bases de données officielles (PubChem, ECHA, INRS) et génère 
              instantanément des analyses de risques complètes et traçables.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Notre parcours</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-200" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-6 pl-12 relative"
                  >
                    <div className="absolute left-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white" />
                    <div className="font-bold text-emerald-600 w-16">{milestone.year}</div>
                    <div className="text-slate-700">{milestone.event}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nos valeurs</h2>
            <p className="text-lg text-slate-600">Les principes qui guident notre travail au quotidien</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-slate-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Notre équipe</h2>
            <p className="text-lg text-slate-600">Des experts passionnés par la sécurité chimique</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg text-slate-900">{member.name}</h3>
                <p className="text-emerald-600 text-sm mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm mb-4">{member.bio}</p>
                <a href={member.linkedin} className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600">
                  <Linkedin className="w-5 h-5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez l'aventure ChemRisk Pro
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Essayez gratuitement pendant 7 jours, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                  Essayer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 gap-2">
                  <Mail className="w-4 h-4" />
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}