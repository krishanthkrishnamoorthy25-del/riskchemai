import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const ROLES = {
  student: 'Étudiant',
  researcher: 'Chercheur',
  engineer: 'Ingénieur',
  teacher: 'Enseignant',
  other: 'Autre'
};

export default function LiveRatings() {
  const [user, setUser] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [myRole, setMyRole] = useState('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  // Charger les avis
  const { data: ratings, refetch } = useQuery({
    queryKey: ['user-ratings'],
    queryFn: () => base44.entities.UserRating.list('-created_date', 20),
    initialData: [],
    refetchInterval: 30000 // Refresh toutes les 30s
  });

  // Calculer la moyenne
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const submitRating = async () => {
    if (!user) {
      toast.error('Connectez-vous pour noter');
      return;
    }
    if (myRating === 0) {
      toast.error('Sélectionnez une note');
      return;
    }

    setIsSubmitting(true);
    try {
      // Vérifier si l'utilisateur a déjà noté
      const existing = await base44.entities.UserRating.filter({ user_email: user.email });
      
      if (existing.length > 0) {
        // Mettre à jour
        await base44.entities.UserRating.update(existing[0].id, {
          rating: myRating,
          comment: myComment,
          user_role: myRole,
          user_name: user.full_name || 'Utilisateur'
        });
        toast.success('Avis mis à jour !');
      } else {
        // Créer
        await base44.entities.UserRating.create({
          user_email: user.email,
          rating: myRating,
          comment: myComment,
          user_role: myRole,
          user_name: user.full_name || 'Utilisateur',
          is_verified: true
        });
        toast.success('Merci pour votre avis !');
      }

      setShowRatingModal(false);
      refetch();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header avec stats */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Avis de nos utilisateurs
          </h2>
          <p className="text-slate-600 mb-6">
            Notes vérifiées d'utilisateurs réels de la plateforme
          </p>
          
          {/* Stats globales */}
          <div className="inline-flex items-center gap-8 p-6 bg-slate-50 rounded-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span className="text-3xl font-bold text-slate-900">{averageRating}</span>
                <span className="text-slate-500">/5</span>
              </div>
              <p className="text-sm text-slate-500">Note moyenne</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-5 h-5 text-emerald-500" />
                <span className="text-3xl font-bold text-slate-900">{ratings.length}</span>
              </div>
              <p className="text-sm text-slate-500">Avis vérifiés</p>
            </div>
          </div>
        </div>

        {/* Avis en grille */}
        {ratings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AnimatePresence>
              {ratings.slice(0, 6).map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {rating.user_name || 'Utilisateur'}
                        </span>
                        {rating.is_verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {ROLES[rating.user_role] || 'Utilisateur'}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-slate-600 text-sm">"{rating.comment}"</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl mb-12">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Soyez le premier à donner votre avis !</p>
          </div>
        )}

        {/* CTA pour noter */}
        <div className="text-center">
          <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                <Star className="w-4 h-4" />
                Donner mon avis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Votre avis compte</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Étoiles */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-3">Votre note</p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setMyRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= myRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profil */}
                <div>
                  <p className="text-sm text-slate-600 mb-2">Votre profil</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ROLES).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setMyRole(key)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          myRole === key
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commentaire */}
                <div>
                  <p className="text-sm text-slate-600 mb-2">Commentaire (optionnel)</p>
                  <Textarea
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    className="h-24"
                    maxLength={300}
                  />
                  <p className="text-xs text-slate-400 mt-1">{myComment.length}/300</p>
                </div>

                <Button
                  onClick={submitRating}
                  disabled={isSubmitting || myRating === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-slate-500">
                    Vous devez être connecté pour donner votre avis
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}