import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Calendar, TrendingUp, Clock, Zap } from 'lucide-react';

export default function DashboardStats({ subscription, analysisLogs, simulationsCount = 0 }) {
  const plan = subscription?.plan || 'trial';
  const analysesCount = subscription?.analyses_count_this_month || 0;
  const simsCount = subscription?.simulations_count_this_month || simulationsCount || 0;

  // Limites selon le plan
  const getLimits = () => {
    if (plan === 'enterprise') return { rampe: Infinity, simulations: Infinity };
    if (plan === 'standard') return { rampe: 100, simulations: 100 };
    if (plan === 'student') return { rampe: 30, simulations: 30 };
    return { rampe: 10, simulations: 5 }; // trial
  };

  const limits = getLimits();

  const stats = [
    {
      label: 'Plan actuel',
      value: plan === 'trial' ? 'Essai gratuit' : 
             plan === 'student' ? 'Étudiant' :
             plan === 'standard' ? 'Standard' : 
             plan === 'enterprise' ? 'Entreprise' : 'Aucun',
      icon: Calendar,
      color: 'bg-emerald-500'
    },
    {
      label: 'Analyses RAMPE',
      value: limits.rampe === Infinity ? `${analysesCount}` : `${analysesCount}/${limits.rampe}`,
      icon: FlaskConical,
      color: 'bg-blue-500'
    },
    {
      label: 'Simulations',
      value: limits.simulations === Infinity ? `${simsCount}` : `${simsCount}/${limits.simulations}`,
      icon: Zap,
      color: 'bg-purple-500'
    },
    {
      label: 'Statut',
      value: subscription?.status === 'active' ? 'Actif' :
             subscription?.status === 'trialing' ? 'Essai' :
             subscription?.status === 'past_due' ? 'Impayé' : 'Inactif',
      icon: Clock,
      color: subscription?.status === 'active' || subscription?.status === 'trialing' 
        ? 'bg-emerald-500' : 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          <p className="text-sm text-slate-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}