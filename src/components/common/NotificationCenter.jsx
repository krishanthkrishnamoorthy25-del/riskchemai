import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NotificationCenter({ subscription }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const notifs = [];

    // Trial ending notification
    if (subscription?.status === 'trialing' && subscription?.trial_end) {
      const daysLeft = Math.ceil((new Date(subscription.trial_end) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 3 && daysLeft > 0) {
        notifs.push({
          id: 'trial-ending',
          type: 'warning',
          icon: Clock,
          title: 'Fin d\'essai proche',
          message: `Il vous reste ${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai gratuit.`,
          action: 'Voir les offres',
          actionUrl: '/Pricing',
          timestamp: new Date(),
          unread: true
        });
      }
    }

    // Usage limit warning
    if (subscription) {
      const limit = subscription.plan === 'trial' ? 10 : subscription.plan === 'student' ? 200 : 100;
      const usage = subscription.analyses_count_this_month || 0;
      if (usage >= limit * 0.8 && usage < limit) {
        notifs.push({
          id: 'usage-warning',
          type: 'warning',
          icon: AlertTriangle,
          title: 'Limite proche',
          message: `Vous avez utilisé ${usage}/${limit} analyses ce mois.`,
          timestamp: new Date(),
          unread: true
        });
      }
    }

    // Feature announcement
    notifs.push({
      id: 'new-feature',
      type: 'info',
      icon: Sparkles,
      title: 'Nouvelle fonctionnalité',
      message: 'Le simulateur de réactions propose maintenant des mécanismes théoriques.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      unread: false
    });

    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => n.unread).length);
  }, [subscription]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-amber-500 bg-amber-50';
      case 'success': return 'text-emerald-500 bg-emerald-50';
      case 'info': return 'text-blue-500 bg-blue-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              Tout marquer lu
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 hover:bg-slate-50 ${notif.unread ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notif.type)}`}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-slate-900">{notif.title}</p>
                        <button 
                          onClick={() => dismissNotification(notif.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                      {notif.action && (
                        <a 
                          href={notif.actionUrl}
                          className="inline-block mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          {notif.action} →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}