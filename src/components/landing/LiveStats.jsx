import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Users, Zap, Shield } from 'lucide-react';

export default function LiveStats() {
  // Simulated live counters (in production, these would come from an API)
  const [stats, setStats] = useState({
    analyses: 127453,
    users: 2847,
    reactions: 45892,
    uptime: 99.97
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        analyses: prev.analyses + Math.floor(Math.random() * 3),
        users: prev.users,
        reactions: prev.reactions + Math.floor(Math.random() * 2),
        uptime: 99.97
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const statItems = [
    {
      icon: FlaskConical,
      value: formatNumber(stats.analyses),
      label: "Analyses réalisées",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Users,
      value: formatNumber(stats.users),
      label: "Utilisateurs actifs",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Zap,
      value: formatNumber(stats.reactions),
      label: "Réactions simulées",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Shield,
      value: `${stats.uptime}%`,
      label: "Disponibilité",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
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
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Données mises à jour en temps réel
        </div>
      </div>
    </section>
  );
}