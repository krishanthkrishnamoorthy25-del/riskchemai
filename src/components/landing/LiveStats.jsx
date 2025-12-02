import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Sparkles, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function LiveStats() {
  // Fetch real subscriber count from database
  const { data: subscriptions } = useQuery({
    queryKey: ['public-subscriber-count'],
    queryFn: async () => {
      try {
        const subs = await base44.entities.Subscription.filter({
          status: 'active'
        });
        const trialSubs = await base44.entities.Subscription.filter({
          status: 'trialing'
        });
        return [...subs, ...trialSubs];
      } catch {
        return [];
      }
    },
    staleTime: 60000, // Cache 1 minute
    refetchInterval: 30000 // Refresh every 30s
  });

  const subscriberCount = subscriptions?.length || 0;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const statItems = [
    {
      icon: Clock,
      value: "90%",
      label: "Gain de temps sur vos analyses",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      darkBgColor: "dark:bg-emerald-900/30"
    },
    {
      icon: Users,
      value: formatNumber(subscriberCount),
      label: "Clients nous font confiance",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/30",
      live: true
    },
    {
      icon: Sparkles,
      value: "Précis",
      label: "Données vérifiées PubChem & ECHA",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      darkBgColor: "dark:bg-purple-900/30"
    },
    {
      icon: TrendingUp,
      value: "100%",
      label: "Conformité RGPD garantie",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      darkBgColor: "dark:bg-amber-900/30"
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            <span className="font-semibold text-emerald-600">ChemRisk AI</span> — L'outil indispensable pour les professionnels HSE, chimistes et laboratoires
          </p>
        </div>
      </div>
    </section>
  );
}