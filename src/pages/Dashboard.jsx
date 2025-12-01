import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Plus, Settings, AlertTriangle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { addDays, isAfter } from 'date-fns';

import DashboardStats from '@/components/dashboard/DashboardStats';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';
import ChemicalAnalysisForm from '@/components/analysis/ChemicalAnalysisForm';
import RampeTable from '@/components/analysis/RampeTable';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin();
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
  }, []);

  // Load or create subscription
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      if (subs.length > 0) return subs[0];
      
      // Create trial subscription for new users
      const trialEnd = addDays(new Date(), 7);
      const newSub = await base44.entities.Subscription.create({
        user_email: user.email,
        plan: 'trial',
        status: 'trialing',
        trial_start: new Date().toISOString(),
        trial_end: trialEnd.toISOString(),
        analyses_count_this_month: 0
      });
      return newSub;
    },
    enabled: !!user?.email
  });

  // Load analysis logs
  const { data: analysisLogs } = useQuery({
    queryKey: ['analysisLogs', user?.email],
    queryFn: () => base44.entities.AnalysisLog.filter(
      { user_email: user.email },
      '-analysis_date',
      10
    ),
    enabled: !!user?.email
  });

  // Check access
  const hasAccess = () => {
    if (!subscription) return false;
    if (subscription.status === 'active') return true;
    if (subscription.status === 'trialing') {
      if (subscription.trial_end && isAfter(new Date(subscription.trial_end), new Date())) {
        return true;
      }
    }
    return false;
  };

  const getUsageLimit = () => {
    if (!subscription) return 0;
    if (subscription.plan === 'enterprise') return Infinity;
    if (subscription.plan === 'standard') return 100;
    if (subscription.plan === 'trial') return 10;
    return 0;
  };

  const canAnalyze = () => {
    if (!hasAccess()) return false;
    const limit = getUsageLimit();
    if (limit === Infinity) return true;
    return (subscription?.analyses_count_this_month || 0) < limit;
  };

  // Run analysis
  const handleAnalysis = async (substances) => {
    if (!canAnalyze()) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);

    const prompt = `Tu es un expert en sécurité chimique et HSE. Analyse les substances chimiques suivantes et fournis pour chacune un tableau RAMPE complet.

SUBSTANCES À ANALYSER:
${substances.map((s, i) => `${i + 1}. ${s.name}${s.cas ? ` (CAS: ${s.cas})` : ''} - Rôle: ${s.role}`).join('\n')}

Pour chaque substance, fournis:
- Le nom exact et numéro CAS (vérifié si possible)
- Les classes de danger GHS (GHS01 à GHS09)
- Les codes H (mentions de danger)
- Les codes P (conseils de prudence)  
- Un résumé du danger en 1-2 phrases
- Les protections recommandées (EPI, ventilation, stockage, incompatibilités)
- Un score de confiance basé sur la qualité des sources (0 à 1)
- Les sources utilisées (PubChem, ECHA, etc.)

IMPORTANT: Ne fournis AUCUN protocole expérimental, quantité, procédure, température ou étape de manipulation.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            substances: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cas: { type: "string" },
                  role: { type: "string" },
                  ghs_classes: { type: "array", items: { type: "string" } },
                  h_codes: { type: "array", items: { type: "string" } },
                  p_codes: { type: "array", items: { type: "string" } },
                  danger_summary: { type: "string" },
                  protections: {
                    type: "object",
                    properties: {
                      epi: { type: "string" },
                      ventilation: { type: "string" },
                      stockage: { type: "string" },
                      incompatibilites: { type: "string" }
                    }
                  },
                  confidence_score: { type: "number" },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        url: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      setAnalysisResults(response.substances || []);
      setShowAnalysisForm(false);

      // Log analysis (metadata only - RGPD compliant)
      await base44.entities.AnalysisLog.create({
        user_email: user.email,
        analysis_date: new Date().toISOString(),
        substances_count: substances.length,
        export_format: 'none'
      });

      // Update usage count
      await base44.entities.Subscription.update(subscription.id, {
        analyses_count_this_month: (subscription.analyses_count_this_month || 0) + 1
      });

      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['analysisLogs'] });

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async (format) => {
    if (!analysisResults) return;
    
    // Update log with export format
    const logs = await base44.entities.AnalysisLog.filter(
      { user_email: user.email },
      '-analysis_date',
      1
    );
    if (logs.length > 0) {
      await base44.entities.AnalysisLog.update(logs[0].id, { export_format: format });
    }

    // Generate export content
    if (format === 'csv') {
      const headers = ['Nom', 'CAS', 'Rôle', 'GHS', 'Codes H', 'Codes P', 'Danger', 'EPI', 'Confiance'];
      const rows = analysisResults.map(s => [
        s.name,
        s.cas || '',
        s.role || '',
        (s.ghs_classes || []).join('; '),
        (s.h_codes || []).join('; '),
        (s.p_codes || []).join('; '),
        s.danger_summary || '',
        s.protections?.epi || '',
        s.confidence_score || ''
      ]);
      
      const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analyse-rampe-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  if (!user || subLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bonjour, {user.full_name || 'Utilisateur'}
            </h1>
            <p className="text-slate-500">Bienvenue sur votre tableau de bord ChemRisk Pro</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl('Account')}>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Compte
              </Button>
            </Link>
            {canAnalyze() && (
              <Button 
                onClick={() => setShowAnalysisForm(!showAnalysisForm)}
                className="bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle analyse
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats subscription={subscription} analysisLogs={analysisLogs || []} />
        </div>

        {/* Access Warning */}
        {!hasAccess() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Accès limité</h3>
                <p className="text-amber-800 mt-1">
                  Votre période d'essai est terminée ou votre abonnement est inactif. 
                  Passez à un plan payant pour continuer à utiliser ChemRisk Pro.
                </p>
                <Link to={createPageUrl('Pricing')}>
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Usage Warning */}
        {hasAccess() && !canAnalyze() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Limite atteinte</h3>
                <p className="text-amber-800 mt-1">
                  Vous avez atteint votre limite d'analyses pour ce mois. 
                  Passez à un plan supérieur pour plus d'analyses.
                </p>
                <Link to={createPageUrl('Pricing')}>
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                    Augmenter ma limite
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Form */}
        {showAnalysisForm && canAnalyze() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Nouvelle analyse RAMPE</h2>
              <ChemicalAnalysisForm onSubmit={handleAnalysis} isLoading={isAnalyzing} />
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <RampeTable results={analysisResults} onExport={handleExport} />
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalysisHistory logs={analysisLogs || []} />
          </div>
          <div>
            <SubscriptionCard subscription={subscription} />
          </div>
        </div>
      </div>
    </div>
  );
}