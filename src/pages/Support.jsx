import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Book, 
  Search,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/landing/Footer';

const faqCategories = [
  {
    category: 'Utilisation',
    questions: [
      {
        q: "Comment lancer une analyse chimique ?",
        a: "Depuis le Dashboard, cliquez sur 'Nouvelle analyse', ajoutez les substances à analyser (nom et/ou numéro CAS), puis lancez l'analyse. Les résultats s'affichent en quelques secondes."
      },
      {
        q: "Quelles données puis-je exporter ?",
        a: "Vous pouvez exporter vos tableaux RAMPE en format PDF ou CSV. Les exports incluent toutes les informations de l'analyse : GHS, codes H/P, recommandations EPI, etc."
      },
      {
        q: "L'outil génère-t-il des protocoles expérimentaux ?",
        a: "Non. ChemRisk Pro est exclusivement un outil d'identification des risques. Aucun protocole expérimental, quantité, température ou étape de manipulation n'est fourni."
      }
    ]
  },
  {
    category: 'Abonnement',
    questions: [
      {
        q: "Comment fonctionne l'essai gratuit ?",
        a: "L'essai gratuit dure 7 jours et vous donne accès à 10 analyses complètes. Aucune carte bancaire n'est requise. À la fin de l'essai, vous pouvez choisir un plan payant."
      },
      {
        q: "Puis-je changer de plan en cours de mois ?",
        a: "Oui, vous pouvez passer à un plan supérieur à tout moment. Le changement est effectif immédiatement et la différence est calculée au prorata."
      },
      {
        q: "Comment annuler mon abonnement ?",
        a: "Rendez-vous dans votre espace Compte > Abonnement et cliquez sur 'Annuler'. L'annulation prend effet à la fin de la période de facturation en cours."
      }
    ]
  },
  {
    category: 'Données & RGPD',
    questions: [
      {
        q: "Mes analyses chimiques sont-elles conservées ?",
        a: "Non. Conformément à notre politique RGPD, nous ne conservons jamais le contenu de vos analyses. Les données sont traitées en mémoire et immédiatement supprimées."
      },
      {
        q: "Comment exercer mon droit à l'effacement ?",
        a: "Depuis votre espace Compte > Sécurité, vous pouvez demander la suppression de votre compte. Toutes vos données seront effacées sous 30 jours."
      },
      {
        q: "Où sont hébergées mes données ?",
        a: "Toutes nos infrastructures sont hébergées en Union Européenne, garantissant une conformité totale avec le RGPD."
      }
    ]
  }
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    
    setSending(false);
    setSent(true);
    toast.success('Message envoyé ! Notre équipe vous répondra sous 24h.');
    
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  const filteredFaqs = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 mb-6">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">Centre d'aide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Trouvez rapidement des réponses à vos questions ou contactez notre équipe support.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher dans la FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Book, title: 'Documentation', description: 'Guides et tutoriels complets', color: 'emerald' },
              { icon: MessageSquare, title: 'FAQ', description: 'Questions fréquentes', color: 'blue' },
              { icon: Mail, title: 'Contact', description: 'Réponse sous 24h', color: 'purple' }
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href={`#${item.title.toLowerCase()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucun résultat pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">{category.category}</h3>
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.category}-${index}`}
                        className="bg-slate-50 rounded-xl border-none px-6"
                      >
                        <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-5">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-slate-600">
              Notre équipe vous répond sous 24 heures ouvrées.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={sending || sent}
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-6"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Message envoyé !
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
}