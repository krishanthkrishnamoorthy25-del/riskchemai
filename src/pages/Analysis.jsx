import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { addDays, isAfter } from 'date-fns';

import ChemicalAnalysisForm from '@/components/analysis/ChemicalAnalysisForm';
import RampeTable from '@/components/analysis/RampeTable';

export default function Analysis() {
  const [user, setUser] = useState(null);
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

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      if (subs.length > 0) return subs[0];
      
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
- Les codes H (mentions de danger) avec leur signification
- Les codes P (conseils de prudence) avec leur signification
- Un résumé du danger en 1-2 phrases
- Les protections recommandées (EPI spécifiques, type de ventilation, conditions de stockage, incompatibilités chimiques)
- Un score de confiance basé sur la qualité et la fiabilité des sources (0 à 1)
- Les sources utilisées (PubChem, ECHA, etc.) avec liens si disponibles

Utilise les données de PubChem, ECHA, et les bases GHS officielles.

IMPORTANT: Ne fournis AUCUN protocole expérimental, quantité, procédure, température ou étape de manipulation. Ce n'est pas le but de cet outil.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
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

      // Log analysis
      await base44.entities.AnalysisLog.create({
        user_email: user.email,
        analysis_date: new Date().toISOString(),
        substances_count: substances.length,
        export_format: 'none'
      });

      // Update usage
      await base44.entities.Subscription.update(subscription.id, {
        analyses_count_this_month: (subscription.analyses_count_this_month || 0) + 1
      });

      queryClient.invalidateQueries({ queryKey: ['subscription'] });

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async (format) => {
    if (!analysisResults) return;
    
    const logs = await base44.entities.AnalysisLog.filter(
      { user_email: user.email },
      '-analysis_date',
      1
    );
    if (logs.length > 0) {
      await base44.entities.AnalysisLog.update(logs[0].id, { export_format: format });
    }

    if (format === 'csv') {
      const headers = ['Nom', 'CAS', 'Rôle', 'GHS', 'Codes H', 'Codes P', 'Danger', 'EPI', 'Ventilation', 'Stockage', 'Incompatibilités', 'Confiance'];
      const rows = analysisResults.map(s => [
        s.name,
        s.cas || '',
        s.role || '',
        (s.ghs_classes || []).join('; '),
        (s.h_codes || []).join('; '),
        (s.p_codes || []).join('; '),
        s.danger_summary || '',
        s.protections?.epi || '',
        s.protections?.ventilation || '',
        s.protections?.stockage || '',
        s.protections?.incompatibilites || '',
        s.confidence_score || ''
      ]);
      
      const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analyse-rampe-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nouvelle analyse RAMPE</h1>
            <p className="text-slate-500">Identifiez les risques chimiques de vos substances</p>
          </div>
        </div>

        {/* Access Check */}
        {!canAnalyze() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-amber-50 border border-amber-200 rounded-xl text-center"
          >
            <Lock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-semibold text-amber-900 text-lg mb-2">
              {!hasAccess() ? 'Accès limité' : 'Limite atteinte'}
            </h3>
            <p className="text-amber-800 mb-4">
              {!hasAccess() 
                ? 'Votre période d\'essai est terminée ou votre abonnement est inactif.'
                : 'Vous avez atteint votre limite d\'analyses pour ce mois.'}
            </p>
            <Link to={createPageUrl('Pricing')}>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Voir les tarifs
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Form */}
            {!analysisResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <ChemicalAnalysisForm onSubmit={handleAnalysis} isLoading={isAnalyzing} />
              </motion.div>
            )}

            {/* Results */}
            {analysisResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={() => setAnalysisResults(null)}
                  >
                    ← Nouvelle analyse
                  </Button>
                </div>
                <RampeTable results={analysisResults} onExport={handleExport} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}