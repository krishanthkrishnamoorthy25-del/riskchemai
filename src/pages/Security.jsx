import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, Server, Key, AlertTriangle,
  CheckCircle2, FileText, Globe, Database, Zap,
  RefreshCw, Users, Mail, Clock, Code, Bug
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/landing/Footer';

const securityFeatures = [
  {
    category: 'Protection des accès',
    icon: Lock,
    color: 'bg-blue-500',
    features: [
      { name: 'Authentification sécurisée', desc: 'Login via OAuth2 avec tokens JWT', status: 'active' },
      { name: 'Sessions chiffrées', desc: 'Cookies sécurisés HttpOnly + SameSite', status: 'active' },
      { name: 'Rate limiting', desc: 'Protection anti-brute force (100 req/min)', status: 'active' },
      { name: 'CAPTCHA intelligent', desc: 'Détection automatique des bots', status: 'active' },
      { name: '2FA (bientôt)', desc: 'Double authentification TOTP', status: 'planned' }
    ]
  },
  {
    category: 'Protection des données',
    icon: Database,
    color: 'bg-emerald-500',
    features: [
      { name: 'Chiffrement AES-256', desc: 'Données sensibles chiffrées au repos', status: 'active' },
      { name: 'TLS 1.3', desc: 'Communications chiffrées de bout en bout', status: 'active' },
      { name: 'Pas de stockage analyses', desc: 'Résultats non conservés (RGPD)', status: 'active' },
      { name: 'Hash Argon2id', desc: 'Mots de passe hashés avec Argon2id', status: 'active' },
      { name: 'Backup chiffrés', desc: 'Sauvegardes quotidiennes cryptées', status: 'active' }
    ]
  },
  {
    category: 'Protection infrastructure',
    icon: Server,
    color: 'bg-purple-500',
    features: [
      { name: 'WAF (Firewall applicatif)', desc: 'Protection contre injections SQL/XSS', status: 'active' },
      { name: 'Protection DDoS', desc: 'Mitigation automatique des attaques', status: 'active' },
      { name: 'CDN sécurisé', desc: 'Distribution via réseau protégé', status: 'active' },
      { name: 'Isolation containers', desc: 'Services isolés via Docker', status: 'active' },
      { name: 'Monitoring 24/7', desc: 'Surveillance temps réel des menaces', status: 'active' }
    ]
  },
  {
    category: 'Conformité & Audits',
    icon: FileText,
    color: 'bg-amber-500',
    features: [
      { name: 'RGPD compliant', desc: 'Conforme réglementation européenne', status: 'active' },
      { name: 'Logs sécurisés', desc: 'Journalisation des accès anonymisée', status: 'active' },
      { name: 'Scans vulnérabilités', desc: 'Tests automatisés hebdomadaires', status: 'active' },
      { name: 'Politique sécurité', desc: 'SECURITY.md public sur demande', status: 'active' },
      { name: 'Rotation clés API', desc: 'Renouvellement automatique 90 jours', status: 'active' }
    ]
  }
];

const threatProtections = [
  { threat: 'Attaques DDoS', protection: 'Rate limiting + CDN + Auto-scaling', icon: Zap },
  { threat: 'Injection SQL', protection: 'Requêtes paramétrées + WAF', icon: Code },
  { threat: 'Cross-Site Scripting (XSS)', protection: 'CSP strict + Échappement auto', icon: Bug },
  { threat: 'Brute Force', protection: 'Blocage IP après 5 tentatives', icon: Lock },
  { threat: 'Man-in-the-Middle', protection: 'TLS 1.3 + HSTS', icon: Eye },
  { threat: 'Session Hijacking', protection: 'Tokens rotatifs + Fingerprinting', icon: Key }
];

const certifications = [
  { name: 'RGPD', desc: 'Règlement Général sur la Protection des Données', icon: '🇪🇺' },
  { name: 'HTTPS A+', desc: 'Score SSL Labs A+', icon: '🔒' },
  { name: 'OWASP', desc: 'Top 10 vulnérabilités couvertes', icon: '🛡️' },
  { name: 'SOC 2 Type II', desc: 'En cours de certification', icon: '📋' }
];

export default function Security() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Sécurité Enterprise-Grade</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Cybersécurité & Protection des Données
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              ChemRisk AI est conçu avec la sécurité au cœur de son architecture. 
              Vos données chimiques sensibles sont protégées par des mesures de sécurité de niveau bancaire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '99.9%', label: 'Uptime garanti', icon: Clock },
              { value: 'AES-256', label: 'Chiffrement', icon: Lock },
              { value: '0', label: 'Données conservées', icon: Database },
              { value: '24/7', label: 'Monitoring', icon: Eye }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-xl"
              >
                <stat.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Mesures de sécurité implémentées
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 ${category.color} rounded-lg`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            feature.status === 'active' ? 'text-emerald-500' : 'text-slate-300'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{feature.name}</span>
                              {feature.status === 'planned' && (
                                <Badge variant="outline" className="text-xs">Bientôt</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Protection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Protection contre les menaces
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Notre infrastructure est protégée contre les attaques les plus courantes
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threatProtections.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.threat}</h3>
                    <p className="text-sm text-slate-600">{item.protection}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Conformité & Certifications
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <span className="text-4xl mb-4 block">{cert.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{cert.name}</h3>
                <p className="text-sm text-slate-400">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug Bounty / Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Signaler une vulnérabilité
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Vous avez découvert une faille de sécurité ? Nous prenons cela très au sérieux.
                    Contactez notre équipe sécurité de manière responsable.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Mail className="w-4 h-4" />
                    security@chemrisk-ai.com
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Réponse garantie sous 24h. Programme Bug Bounty en préparation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* RGPD Reminder */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Hébergé en Union Européenne</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Database className="w-5 h-5 text-emerald-500" />
              <span>Aucune donnée d'analyse conservée</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-5 h-5 text-purple-500" />
              <span>DPO disponible sur demande</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}