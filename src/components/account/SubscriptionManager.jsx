import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  RefreshCw,
  XCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { format, addMonths, addYears, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { base44 } from '@/api/base44Client';

export default function SubscriptionManager({ subscription, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!subscription) return null;

  const isAnnual = subscription.plan === 'enterprise' || subscription.billing_period === 'annual';
  const isMonthly = !isAnnual && subscription.plan !== 'trial';
  const autoRenew = subscription.auto_renew !== false; // Default to true
  
  const currentPeriodEnd = subscription.current_period_end 
    ? new Date(subscription.current_period_end)
    : subscription.trial_end 
      ? new Date(subscription.trial_end)
      : addMonths(new Date(subscription.created_date || new Date()), 1);

  const isTrialExpired = subscription.status === 'trialing' && 
    subscription.trial_end && 
    isBefore(new Date(subscription.trial_end), new Date());

  const canCancel = subscription.status === 'active' && isMonthly;
  const canToggleAutoRenew = subscription.status === 'active' && isMonthly;

  // For annual plans, calculate months remaining
  const getAnnualMonthsRemaining = () => {
    if (!isAnnual || !subscription.current_period_start) return 0;
    const startDate = new Date(subscription.current_period_start);
    const endDate = addYears(startDate, 1);
    const now = new Date();
    const monthsRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, monthsRemaining);
  };

  const handleToggleAutoRenew = async () => {
    setIsUpdating(true);
    try {
      await base44.entities.Subscription.update(subscription.id, {
        auto_renew: !autoRenew
      });
      toast.success(autoRenew 
        ? 'Renouvellement automatique désactivé' 
        : 'Renouvellement automatique activé'
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsUpdating(true);
    try {
      await base44.entities.Subscription.update(subscription.id, {
        status: 'cancelled',
        auto_renew: false,
        cancelled_at: new Date().toISOString()
      });
      toast.success('Abonnement résilié. Vous conservez l\'accès jusqu\'au ' + 
        format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr }));
      setShowCancelDialog(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la résiliation');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReactivate = async () => {
    setIsUpdating(true);
    try {
      await base44.entities.Subscription.update(subscription.id, {
        status: 'active',
        auto_renew: true,
        cancelled_at: null
      });
      toast.success('Abonnement réactivé avec succès');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la réactivation');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPlanDetails = () => {
    switch (subscription.plan) {
      case 'trial':
        return { name: 'Essai Gratuit', price: '0€', color: 'bg-slate-100 text-slate-700' };
      case 'student':
        return { name: 'Étudiant', price: '9,90€/mois', color: 'bg-blue-100 text-blue-700' };
      case 'standard':
        return { name: 'PME / Artisans', price: '49€/mois', color: 'bg-purple-100 text-purple-700' };
      case 'enterprise':
        return { name: 'Entreprise', price: '199€/mois', color: 'bg-amber-100 text-amber-700' };
      default:
        return { name: subscription.plan, price: '-', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Gérer mon abonnement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Plan actuel</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">{planDetails.name}</span>
                <Badge className={planDetails.color}>{planDetails.price}</Badge>
              </div>
            </div>
            <Badge className={
              subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              subscription.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
              subscription.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-slate-100 text-slate-700'
            }>
              {subscription.status === 'active' ? 'Actif' :
               subscription.status === 'trialing' ? 'Essai' :
               subscription.status === 'cancelled' ? 'Résilié' :
               subscription.status}
            </Badge>
          </div>

          {/* Period Info */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            {subscription.status === 'trialing' ? (
              <span>Fin de l'essai : {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}</span>
            ) : subscription.status === 'cancelled' ? (
              <span>Accès jusqu'au : {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}</span>
            ) : (
              <span>
                {autoRenew ? 'Prochain renouvellement' : 'Expire le'} : {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}
              </span>
            )}
          </div>
        </div>

        {/* Annual Plan Lock Notice */}
        {isAnnual && subscription.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Engagement annuel</p>
                <p className="text-sm text-amber-700 mt-1">
                  Votre abonnement Entreprise est un engagement de 12 mois. 
                  Il reste <strong>{getAnnualMonthsRemaining()} mois</strong> avant la fin de votre engagement.
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  La résiliation sera possible à la fin de la période d'engagement.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto-Renew Toggle (Monthly only) */}
        {canToggleAutoRenew && subscription.status === 'active' && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className={`w-5 h-5 ${autoRenew ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="font-medium text-slate-900">Renouvellement automatique</p>
                  <p className="text-sm text-slate-500">
                    {autoRenew 
                      ? 'Votre abonnement sera renouvelé automatiquement'
                      : 'Votre abonnement expirera à la fin de la période'
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={autoRenew}
                onCheckedChange={handleToggleAutoRenew}
                disabled={isUpdating}
              />
            </div>
            
            {!autoRenew && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-amber-50 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>L'abonnement se terminera le {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Cancelled Status */}
        {subscription.status === 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Abonnement résilié</p>
                <p className="text-sm text-red-700 mt-1">
                  Vous conservez l'accès jusqu'au {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}.
                  Après cette date, vous passerez en mode gratuit limité.
                </p>
                <Button 
                  onClick={handleReactivate}
                  disabled={isUpdating}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Réactiver mon abonnement
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trial Expired */}
        {isTrialExpired && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Période d'essai terminée</p>
                <p className="text-sm text-amber-700 mt-1">
                  Passez à un abonnement payant pour continuer à utiliser toutes les fonctionnalités.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cancel Button (Monthly only, not annual) */}
        {canCancel && !isAnnual && (
          <div className="pt-4 border-t border-slate-200">
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                  <XCircle className="w-4 h-4 mr-2" />
                  Résilier mon abonnement
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la résiliation</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>Êtes-vous sûr de vouloir résilier votre abonnement ?</p>
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
                      <p className="font-medium">Vous conserverez l'accès jusqu'au :</p>
                      <p className="text-lg font-bold mt-1">
                        {format(currentPeriodEnd, 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <p className="text-sm">
                      Après cette date, vous passerez automatiquement en mode gratuit avec des fonctionnalités limitées.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isUpdating ? 'Résiliation...' : 'Confirmer la résiliation'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <p className="text-xs text-slate-500 mt-2">
              La résiliation prendra effet à la fin de la période de facturation en cours.
            </p>
          </div>
        )}

        {/* Usage Stats */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-3">Utilisation ce mois</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">
                {subscription.analyses_count_this_month || 0}
              </p>
              <p className="text-xs text-slate-500">Analyses RAMPE</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">
                {subscription.simulations_count_this_month || 0}
              </p>
              <p className="text-xs text-slate-500">Simulations</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}