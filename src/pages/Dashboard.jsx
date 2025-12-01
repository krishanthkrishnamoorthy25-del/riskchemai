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
import ReactionSimulator from '@/components/analysis/ReactionSimulator';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQuickSearching, setIsQuickSearching] = useState(false);
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

  const getUsageLimit = (type = 'rampe') => {
    if (!subscription) return 0;
    if (subscription.plan === 'enterprise') return Infinity;
    if (subscription.plan === 'standard') return 100;
    if (subscription.plan === 'student') return 30;
    if (subscription.plan === 'trial') {
      return type === 'simulator' ? 5 : 10;
    }
    return 0;
  };

  const getRemainingAnalyses = (type = 'rampe') => {
    const limit = getUsageLimit(type);
    if (limit === Infinity) return Infinity;
    const count = type === 'simulator' 
      ? (subscription?.simulations_count_this_month || 0)
      : (subscription?.analyses_count_this_month || 0);
    return Math.max(0, limit - count);
  };

  const canAnalyze = (type = 'rampe') => {
    if (!hasAccess()) return false;
    const limit = getUsageLimit(type);
    if (limit === Infinity) return true;
    const count = type === 'simulator' 
      ? (subscription?.simulations_count_this_month || 0)
      : (subscription?.analyses_count_this_month || 0);
    return count < limit;
  };

  // Fonction pour incrémenter le compteur du simulateur
  const incrementSimulatorUsage = async () => {
    if (!subscription) return;
    await base44.entities.Subscription.update(subscription.id, {
      simulations_count_this_month: (subscription.simulations_count_this_month || 0) + 1
    });
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
  };

  // Run analysis
  const handleAnalysis = async (substances) => {
    if (!canAnalyze()) return;
    
    setIsAnalyzing(true);
    setAnalysisResults(null);

    const prompt = `Tu es un expert en sécurité chimique et HSE. Analyse les substances chimiques suivantes en utilisant les bases de données PubChem et ECHA.

SUBSTANCES À ANALYSER:
${substances.map((s, i) => `${i + 1}. ${s.name}${s.cas ? ` (CAS: ${s.cas})` : ''} - Rôle: ${s.role}`).join('\n')}

POUR CHAQUE SUBSTANCE, FOURNIS OBLIGATOIREMENT:

1. IDENTIFICATION EXACTE (recherche dans PubChem/ECHA par le numéro CAS si fourni):
   - name: Le nom exact officiel de la substance
   - cas: Le numéro CAS vérifié (format: XXXXX-XX-X)
   - iupac_name: Le nom IUPAC complet
   - molecular_formula: La formule brute (ex: H2SO4, C2H5OH, NaOH)
   - molecular_weight: La masse molaire en g/mol (nombre décimal)
   - synonyms: Liste des autres noms commerciaux courants (2-3 max)

2. CLASSIFICATION GHS:
   - ghs_classes: Liste des codes GHS applicables (GHS01 à GHS09)
   - h_codes: Tous les codes H avec leur signification courte
   - p_codes: Tous les codes P pertinents

3. DANGERS:
   - danger_summary: Résumé des dangers en 1-2 phrases claires

4. PROTECTIONS:
   - protections.epi: EPI spécifiques requis
   - protections.ventilation: Type de ventilation nécessaire
   - protections.stockage: Conditions de stockage
   - protections.incompatibilites: Substances incompatibles

5. MÉTA:
   - confidence_score: Score de confiance (0.0 à 1.0) basé sur la fiabilité des sources
   - sources: Références avec URLs vers PubChem, ECHA, etc.
   - role: Le rôle fourni par l'utilisateur

IMPORTANT: Utilise les données exactes de PubChem. Ne fournis AUCUN protocole expérimental.`;

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
                  iupac_name: { type: "string" },
                  molecular_formula: { type: "string" },
                  molecular_weight: { type: "number" },
                  synonyms: { type: "array", items: { type: "string" } },
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

  // Quick search to add substance to existing results
  const handleQuickSearch = async (query) => {
    if (!canAnalyze()) return;
    
    setIsQuickSearching(true);

    const prompt = `Tu es un expert en sécurité chimique. Analyse cette substance en utilisant PubChem et ECHA:

SUBSTANCE: ${query}

FOURNIS L'IDENTIFICATION EXACTE ET LES RISQUES (même format que précédemment):
- name, cas, iupac_name, molecular_formula, molecular_weight, synonyms
- ghs_classes, h_codes, p_codes, danger_summary
- protections (epi, ventilation, stockage, incompatibilites)
- confidence_score, sources

IMPORTANT: Ne fournis AUCUN protocole expérimental.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            cas: { type: "string" },
            iupac_name: { type: "string" },
            molecular_formula: { type: "string" },
            molecular_weight: { type: "number" },
            synonyms: { type: "array", items: { type: "string" } },
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
      });

      // Add to existing results
      const newSubstance = { ...response, role: 'Recherche rapide' };
      setAnalysisResults(prev => prev ? [...prev, newSubstance] : [newSubstance]);

      // Update usage
      await base44.entities.Subscription.update(subscription.id, {
        analyses_count_this_month: (subscription.analyses_count_this_month || 0) + 1
      });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });

    } catch (error) {
      console.error('Quick search error:', error);
    } finally {
      setIsQuickSearching(false);
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
      const headers = ['Nom', 'CAS', 'Formule', 'Masse Molaire (g/mol)', 'Rôle', 'GHS', 'Codes H', 'Codes P', 'Danger', 'EPI', 'Ventilation', 'Stockage', 'Incompatibilités', 'Confiance'];
      const rows = analysisResults.map(s => [
        s.name,
        s.cas || '',
        s.molecular_formula || '',
        s.molecular_weight || '',
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
            <RampeTable 
              results={analysisResults} 
              onExport={handleExport}
              onQuickSearch={canAnalyze() ? handleQuickSearch : null}
              isSearching={isQuickSearching}
            />
          </motion.div>
        )}

        {/* Reaction Simulator */}
        {hasAccess() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ReactionSimulator 
              canSimulate={canAnalyze('simulator')} 
              remainingAnalyses={getRemainingAnalyses('simulator')}
              onSimulationComplete={incrementSimulatorUsage}
            />
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