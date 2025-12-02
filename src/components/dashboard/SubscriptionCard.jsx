import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, ArrowRight, AlertTriangle, FlaskConical, Zap } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SubscriptionCard({ subscription }) {
  if (!subscription) return null;

  const isTrialing = subscription.status === 'trialing';
  const trialDaysLeft = isTrialing && subscription.trial_end 
    ? differenceInDays(new Date(subscription.trial_end), new Date())
    : 0;

  // Limites séparées pour RAMPE et Simulations
  const plan = subscription.plan || 'trial';
  const getLimits = () => {
    if (plan === 'enterprise') return { rampe: null, simulations: null };
    if (plan === 'standard') return { rampe: 100, simulations: 100 };
    if (plan === 'student') return { rampe: 30, simulations: 30 };
    return { rampe: 10, simulations: 5 }; // trial
  };
  const limits = getLimits();
  
  const rampeCount = subscription.analyses_count_this_month || 0;
  const simCount = subscription.simulations_count_this_month || 0;
  const rampePercent = limits.rampe ? (rampeCount / limits.rampe) * 100 : 0;
  const simPercent = limits.simulations ? (simCount / limits.simulations) * 100 : 0;

  const planNames = {
    trial: 'Essai gratuit',
    student: 'Étudiant',
    standard: 'Standard',
    enterprise: 'Entreprise'
  };

  const planPrices = {
    trial: '0€',
    student: '9,99€/mois',
    standard: '29,99€/mois',
    enterprise: '89,99€/mois'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Votre abonnement</h3>
            <p className="text-sm text-slate-500">{planNames[subscription.plan]}</p>
          </div>
          <Badge 
            className={
              subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              subscription.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
              subscription.status === 'past_due' ? 'bg-red-100 text-red-700' :
              'bg-slate-100 text-slate-700'
            }
          >
            {subscription.status === 'active' ? 'Actif' :
             subscription.status === 'trialing' ? 'Essai' :
             subscription.status === 'past_due' ? 'Impayé' :
             subscription.status === 'cancelled' ? 'Annulé' : 'Expiré'}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Trial Warning */}
        {isTrialing && trialDaysLeft <= 3 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {trialDaysLeft <= 0 ? "Votre essai est terminé" : `Il vous reste ${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} d'essai`}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Passez à un plan payant pour continuer à utiliser ChemRisk Pro.
              </p>
            </div>
          </div>
        )}

        {/* Usage - Analyses RAMPE */}
        {limits.rampe && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" /> Analyses RAMPE
              </span>
              <span className="text-sm font-medium text-slate-900">
                {rampeCount} / {limits.rampe}
              </span>
            </div>
            <Progress value={rampePercent} className="h-2" />
          </div>
        )}

        {/* Usage - Simulations */}
        {limits.simulations && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Simulations réactions
              </span>
              <span className="text-sm font-medium text-slate-900">
                {simCount} / {limits.simulations}
              </span>
            </div>
            <Progress value={simPercent} className="h-2" />
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Tarif</span>
            </div>
            <p className="font-semibold text-slate-900">{planPrices[subscription.plan]}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">
                {isTrialing ? 'Fin essai' : 'Prochain paiement'}
              </span>
            </div>
            <p className="font-semibold text-slate-900">
              {isTrialing && subscription.trial_end
                ? format(new Date(subscription.trial_end), 'd MMM yyyy', { locale: fr })
                : subscription.current_period_end
                  ? format(new Date(subscription.current_period_end), 'd MMM yyyy', { locale: fr })
                  : '-'}
            </p>
          </div>
        </div>

        {/* CTA */}
        {(isTrialing || subscription.plan === 'standard') && (
          <Link to={createPageUrl('Pricing')}>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2">
              {isTrialing ? 'Passer à un plan payant' : 'Passer à Entreprise'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}