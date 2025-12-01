import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  MessageSquare, 
  Building2, 
  Clock, 
  Send,
  MapPin,
  Shield,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/landing/Footer';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    toast.success('Message envoyé avec succès !');
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email général',
      value: 'contact@chemriskpro.eu',
      description: 'Pour toute demande d\'information'
    },
    {
      icon: Building2,
      title: 'Service commercial',
      value: 'sales@chemriskpro.eu',
      description: 'Devis entreprise et partenariats'
    },
    {
      icon: Shield,
      title: 'DPO / RGPD',
      value: 'dpo@chemriskpro.eu',
      description: 'Protection des données personnelles'
    },
    {
      icon: Clock,
      title: 'Support technique',
      value: 'support@chemriskpro.eu',
      description: 'Assistance et questions techniques'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Message envoyé !
          </h1>
          <p className="text-slate-600 mb-8">
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais, 
            généralement sous 24 à 48 heures ouvrées.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Envoyer un autre message
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Contactez-nous
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Une question, une demande de devis ou un partenariat ? 
              Notre équipe est à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email professionnel *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Organisation / Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="w-full mt-1 h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="demo">Demande de démonstration</option>
                    <option value="quote">Demande de devis entreprise</option>
                    <option value="technical">Question technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="rgpd">RGPD / Protection des données</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={5}
                    className="mt-1"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Nos coordonnées
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div 
                    key={info.title}
                    className="p-4 bg-slate-50 rounded-xl flex items-start gap-4"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <info.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{info.title}</h3>
                      <a 
                        href={`mailto:${info.value}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        {info.value}
                      </a>
                      <p className="text-xs text-slate-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Location */}
              <div className="mt-8 p-6 bg-slate-900 rounded-xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold">Siège social</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  ChemRisk Pro SAS<br />
                  Union Européenne 🇪🇺<br />
                  <span className="text-xs text-slate-400">
                    Hébergement et données en Europe
                  </span>
                </p>
              </div>

              {/* Response time */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Délai de réponse moyen : 24-48h ouvrées
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}