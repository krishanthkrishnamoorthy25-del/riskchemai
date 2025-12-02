import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, Bell, ExternalLink, Calendar, Tag,
  AlertTriangle, FileText, Beaker, BookOpen, Loader2,
  CheckCircle2, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import Footer from '@/components/landing/Footer';

const CATEGORIES = {
  regulation: { label: 'Réglementation', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  safety: { label: 'Sécurité', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
  research: { label: 'Recherche', color: 'bg-blue-100 text-blue-700', icon: BookOpen },
  substance: { label: 'Substances', color: 'bg-purple-100 text-purple-700', icon: Beaker },
  method: { label: 'Méthodes', color: 'bg-emerald-100 text-emerald-700', icon: FileText }
};

const SOURCES = {
  echa: { label: 'ECHA', color: 'bg-blue-600' },
  pubchem: { label: 'PubChem', color: 'bg-indigo-600' },
  inrs: { label: 'INRS', color: 'bg-red-600' },
  acs: { label: 'ACS', color: 'bg-amber-600' },
  rsc: { label: 'RSC', color: 'bg-emerald-600' },
  nature: { label: 'Nature', color: 'bg-purple-600' },
  science: { label: 'Science', color: 'bg-pink-600' },
  regulation: { label: 'Officiel', color: 'bg-slate-600' }
};

export default function News() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les articles
  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['news-articles'],
    queryFn: () => base44.entities.NewsArticle.list('-published_date', 50),
    initialData: []
  });

  // Rafraîchir les actualités depuis les sources
  const refreshNews = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un veilleur scientifique spécialisé en chimie et sécurité. Recherche les dernières actualités importantes de ces sources:

1. ECHA (European Chemicals Agency) - Nouvelles réglementations REACH, restrictions substances
2. INRS - Nouvelles fiches toxicologiques, alertes sécurité
3. PubChem - Nouvelles substances, mises à jour données
4. Publications scientifiques - Découvertes importantes en sécurité chimique

Génère 5 actualités récentes et pertinentes pour des professionnels de la chimie.

Pour chaque actualité, fournis:
- title: titre accrocheur
- summary: résumé en 2-3 phrases
- source: echa/pubchem/inrs/acs/rsc/nature/science/regulation
- category: regulation/safety/research/substance/method
- source_url: URL plausible de la source
- substances_mentioned: liste des substances concernées (CAS ou noms)
- tags: mots-clés pertinents`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  category: { type: "string" },
                  source_url: { type: "string" },
                  substances_mentioned: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      // Sauvegarder les nouveaux articles
      if (response.articles && response.articles.length > 0) {
        for (const article of response.articles) {
          await base44.entities.NewsArticle.create({
            ...article,
            published_date: new Date().toISOString(),
            is_featured: false
          });
        }
        refetch();
        toast.success(`${response.articles.length} nouvelles actualités ajoutées`);
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsRefreshing(false);
    }
  };

  // S'abonner à la newsletter
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Email invalide');
      return;
    }

    setIsSubscribing(true);
    try {
      // Vérifier si déjà abonné
      const existing = await base44.entities.NewsletterSubscription.filter({ email });
      if (existing.length > 0) {
        toast.info('Vous êtes déjà inscrit à la newsletter');
        setIsSubscribing(false);
        return;
      }

      await base44.entities.NewsletterSubscription.create({
        email,
        subscribed_date: new Date().toISOString(),
        status: 'active',
        frequency: 'weekly',
        preferences: {
          regulations: true,
          safety_alerts: true,
          research: false,
          product_updates: true
        }
      });

      toast.success('Inscription réussie ! Vous recevrez notre newsletter.');
      setEmail('');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsSubscribing(false);
    }
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-8 h-8" />
                <span className="text-indigo-200 font-medium">Veille scientifique</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Actualités Chimie & Sécurité
              </h1>
              <p className="text-xl text-indigo-100 mb-6">
                Restez informé des dernières réglementations, alertes de sécurité 
                et avancées scientifiques. Sources vérifiées : ECHA, INRS, PubChem.
              </p>
              <Button
                onClick={refreshNews}
                disabled={isRefreshing}
                className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Actualiser depuis les sources
              </Button>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-6 h-6 text-amber-300" />
                <h2 className="text-xl font-semibold">Newsletter ChemRisk</h2>
              </div>
              <p className="text-indigo-100 mb-6">
                Recevez chaque semaine un résumé des actualités importantes 
                en sécurité chimique directement dans votre boîte mail.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-indigo-200"
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isSubscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  S'inscrire gratuitement
                </Button>
              </form>
              <p className="text-xs text-indigo-200 mt-4 text-center">
                Désabonnement en un clic. Pas de spam.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Tout
            </Button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="gap-1"
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune actualité pour le moment</p>
              <Button onClick={refreshNews} className="mt-4 gap-2">
                <RefreshCw className="w-4 h-4" />
                Charger les actualités
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={CATEGORIES[article.category]?.color || 'bg-slate-100'}>
                          {CATEGORIES[article.category]?.label || article.category}
                        </Badge>
                        <Badge className={`${SOURCES[article.source]?.color || 'bg-slate-600'} text-white text-xs`}>
                          {SOURCES[article.source]?.label || article.source}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-snug">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm mb-4">
                        {article.summary}
                      </p>

                      {article.substances_mentioned?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {article.substances_mentioned.slice(0, 3).map((sub, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.published_date && format(new Date(article.published_date), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        {article.source_url && (
                          <a 
                            href={article.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-600 hover:underline"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Nos sources de veille
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(SOURCES).map(([key, source]) => (
              <div key={key} className="p-4 bg-slate-50 rounded-lg text-center">
                <div className={`w-12 h-12 ${source.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-sm">{source.label.charAt(0)}</span>
                </div>
                <p className="font-medium text-slate-800">{source.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}