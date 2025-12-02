import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, Zap, Plus, Trash2, RefreshCw, Loader2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

// Matrice de compatibilité simplifiée (basée sur CAMEO)
const COMPATIBILITY_MATRIX = {
  'acide_fort': {
    'base_forte': { level: 'danger', reaction: 'Réaction violente, exothermique', gas: ['vapeur d\'eau'] },
    'metal_reactif': { level: 'danger', reaction: 'Dégagement H₂', gas: ['H₂'] },
    'oxydant': { level: 'warning', reaction: 'Possible réaction violente' },
    'reducteur': { level: 'warning', reaction: 'Possible réaction' },
    'cyanure': { level: 'critical', reaction: 'Dégagement HCN mortel', gas: ['HCN'] },
    'sulfure': { level: 'critical', reaction: 'Dégagement H₂S toxique', gas: ['H₂S'] },
    'hypochlorite': { level: 'danger', reaction: 'Dégagement Cl₂', gas: ['Cl₂'] }
  },
  'base_forte': {
    'acide_fort': { level: 'danger', reaction: 'Réaction violente, exothermique', gas: ['vapeur d\'eau'] },
    'metal_amphotere': { level: 'warning', reaction: 'Dégagement H₂', gas: ['H₂'] },
    'ammonium': { level: 'danger', reaction: 'Dégagement NH₃', gas: ['NH₃'] }
  },
  'oxydant': {
    'reducteur': { level: 'critical', reaction: 'Réaction violente possible, risque explosion' },
    'inflammable': { level: 'critical', reaction: 'Risque incendie/explosion' },
    'matiere_organique': { level: 'danger', reaction: 'Risque inflammation spontanée' },
    'peroxyde': { level: 'critical', reaction: 'Risque explosion' }
  },
  'peroxyde': {
    'acide_fort': { level: 'danger', reaction: 'Décomposition violente possible' },
    'metal': { level: 'danger', reaction: 'Catalyse décomposition' },
    'chaleur': { level: 'critical', reaction: 'Décomposition explosive' }
  },
  'inflammable': {
    'oxydant': { level: 'critical', reaction: 'Risque incendie/explosion' },
    'source_ignition': { level: 'critical', reaction: 'Inflammation' }
  }
};

// Classification des substances
const classifySubstance = (substance) => {
  const name = (substance.name || '').toLowerCase();
  const hCodes = substance.h_codes || [];
  const ghsClasses = substance.ghs_classes || [];
  
  const classes = [];
  
  // Acides forts
  if (name.includes('acide sulfurique') || name.includes('acide chlorhydrique') || 
      name.includes('acide nitrique') || name.includes('acide fluorhydrique') ||
      hCodes.some(h => h.includes('H314'))) {
    classes.push('acide_fort');
  }
  
  // Bases fortes
  if (name.includes('hydroxyde') || name.includes('soude') || name.includes('potasse') ||
      name.includes('ammoniaque')) {
    classes.push('base_forte');
  }
  
  // Oxydants
  if (ghsClasses.includes('GHS03') || name.includes('peroxyde') || 
      name.includes('permanganate') || name.includes('nitrate') ||
      name.includes('chlorate') || name.includes('hypochlorite')) {
    classes.push('oxydant');
  }
  
  // Réducteurs
  if (name.includes('sulfite') || name.includes('thiosulfate') ||
      name.includes('hydrazine') || name.includes('borohydrure')) {
    classes.push('reducteur');
  }
  
  // Inflammables
  if (ghsClasses.includes('GHS02') || name.includes('éthanol') || 
      name.includes('acétone') || name.includes('méthanol') ||
      name.includes('toluène') || name.includes('hexane')) {
    classes.push('inflammable');
  }
  
  // Métaux réactifs
  if (name.includes('sodium') || name.includes('potassium') || 
      name.includes('lithium') || name.includes('magnésium')) {
    classes.push('metal_reactif');
  }
  
  // Cyanures
  if (name.includes('cyanure') || name.includes('cyanide')) {
    classes.push('cyanure');
  }
  
  // Sulfures
  if (name.includes('sulfure') && !name.includes('sulfurique')) {
    classes.push('sulfure');
  }
  
  // Hypochlorites
  if (name.includes('hypochlorite') || name.includes('javel')) {
    classes.push('hypochlorite');
  }
  
  // Peroxydes
  if (name.includes('peroxyde')) {
    classes.push('peroxyde');
  }
  
  // Ammonium
  if (name.includes('ammonium')) {
    classes.push('ammonium');
  }
  
  return classes;
};

// Vérifier la compatibilité entre deux substances
const checkCompatibility = (sub1Classes, sub2Classes) => {
  let worstLevel = 'ok';
  const incompatibilities = [];
  const gases = [];
  
  for (const class1 of sub1Classes) {
    if (COMPATIBILITY_MATRIX[class1]) {
      for (const class2 of sub2Classes) {
        if (COMPATIBILITY_MATRIX[class1][class2]) {
          const compat = COMPATIBILITY_MATRIX[class1][class2];
          incompatibilities.push({
            classes: [class1, class2],
            ...compat
          });
          if (compat.gas) gases.push(...compat.gas);
          
          if (compat.level === 'critical') worstLevel = 'critical';
          else if (compat.level === 'danger' && worstLevel !== 'critical') worstLevel = 'danger';
          else if (compat.level === 'warning' && worstLevel === 'ok') worstLevel = 'warning';
        }
      }
    }
  }
  
  return { level: worstLevel, incompatibilities, gases: [...new Set(gases)] };
};

// Alternatives pour les réactifs incompatibles
const ALTERNATIVES = {
  'acide_fort': ['acide citrique', 'acide acétique', 'tampon acide'],
  'base_forte': ['carbonate de sodium', 'bicarbonate de sodium', 'tampon basique'],
  'oxydant': ['air/O₂', 'peroxyde d\'hydrogène dilué'],
  'reducteur': ['acide ascorbique', 'sulfite de sodium'],
  'cyanure': ['AUCUNE - éviter absolument'],
  'hypochlorite': ['peroxyde d\'hydrogène', 'peracide'],
  'peroxyde': ['oxygène', 'air comprimé'],
  'inflammable': ['solvants verts (eau, éthanol)', 'solvants eutectiques profonds']
};

export default function IncompatibilityMatrix({ substances = [] }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [customReactants, setCustomReactants] = useState([]);
  const [newReactant, setNewReactant] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alternativesResult, setAlternativesResult] = useState(null);
  
  // Combiner substances analysées et réactifs personnalisés
  const allSubstances = [...substances, ...customReactants];
  
  if (allSubstances.length < 2 && customReactants.length === 0) {
    // Afficher quand même le formulaire pour ajouter des réactifs
  }
  
  // Ajouter un réactif personnalisé
  const addCustomReactant = async () => {
    if (!newReactant.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Classifie cette substance chimique pour déterminer ses incompatibilités: "${newReactant}"
        
Fournis:
- name: nom correct
- classes: parmi [acide_fort, base_forte, oxydant, reducteur, inflammable, metal_reactif, cyanure, sulfure, hypochlorite, peroxyde, ammonium]
- h_codes: codes H principaux si connus`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            classes: { type: "array", items: { type: "string" } },
            h_codes: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setCustomReactants(prev => [...prev, {
        name: response.name || newReactant,
        classes: response.classes || [],
        h_codes: response.h_codes || [],
        isCustom: true
      }]);
      setNewReactant('');
    } catch (error) {
      console.error('Error classifying reactant:', error);
      // Ajouter quand même sans classification
      setCustomReactants(prev => [...prev, {
        name: newReactant,
        classes: [],
        h_codes: [],
        isCustom: true
      }]);
      setNewReactant('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeCustomReactant = (index) => {
    setCustomReactants(prev => prev.filter((_, i) => i !== index));
  };

  // Proposer des alternatives pour une paire incompatible
  const suggestAlternatives = async (pair) => {
    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ces deux réactifs sont incompatibles: "${pair.sub1}" et "${pair.sub2}"
Problème: ${pair.incompatibilities[0]?.reaction}

Propose des ALTERNATIVES pour réaliser une réaction similaire en toute sécurité:
1. Un réactif alternatif pour remplacer ${pair.sub1}
2. Un réactif alternatif pour remplacer ${pair.sub2}
3. Une méthode alternative (conditions, catalyseur, etc.)

Sois précis et pratique.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            alternative_for_first: { type: "string" },
            alternative_for_second: { type: "string" },
            alternative_method: { type: "string" },
            safety_note: { type: "string" }
          }
        }
      });
      
      setAlternativesResult({
        pair,
        ...response
      });
    } catch (error) {
      console.error('Error suggesting alternatives:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Classifier toutes les substances
  const classifiedSubstances = allSubstances.map(s => ({
    ...s,
    classes: s.classes || classifySubstance(s)
  }));
  
  // Générer la matrice
  const matrix = [];
  const allGases = new Set();
  const criticalPairs = [];
  
  for (let i = 0; i < classifiedSubstances.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < classifiedSubstances.length; j++) {
      if (i === j) {
        matrix[i][j] = { level: 'self' };
      } else if (i > j) {
        matrix[i][j] = matrix[j][i]; // Symétrique
      } else {
        const compat = checkCompatibility(
          classifiedSubstances[i].classes,
          classifiedSubstances[j].classes
        );
        matrix[i][j] = compat;
        compat.gases.forEach(g => allGases.add(g));
        if (compat.level === 'critical' || compat.level === 'danger') {
          criticalPairs.push({
            sub1: classifiedSubstances[i].name,
            sub2: classifiedSubstances[j].name,
            ...compat
          });
        }
      }
    }
  }
  
  const getLevelColor = (level) => {
    switch(level) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'danger': return 'bg-orange-500 hover:bg-orange-600';
      case 'warning': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'ok': return 'bg-green-500 hover:bg-green-600';
      case 'self': return 'bg-slate-200';
      default: return 'bg-slate-100';
    }
  };
  
  const getLevelIcon = (level) => {
    switch(level) {
      case 'critical': return <XCircle className="w-4 h-4 text-white" />;
      case 'danger': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'warning': return <HelpCircle className="w-4 h-4 text-white" />;
      case 'ok': return <CheckCircle2 className="w-4 h-4 text-white" />;
      default: return null;
    }
  };
  
  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
          <Zap className="w-5 h-5" />
          Matrice d'Incompatibilités Chimiques
        </CardTitle>
        <p className="text-sm text-orange-600">
          Analyse basée sur les classifications CAMEO et GHS
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire pour ajouter des réactifs */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter des réactifs à tester
          </h4>
          <div className="flex gap-2 mb-3">
            <Input
              value={newReactant}
              onChange={(e) => setNewReactant(e.target.value)}
              placeholder="Ex: acide sulfurique, hydroxyde de sodium..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addCustomReactant()}
              disabled={isAnalyzing}
            />
            <Button 
              onClick={addCustomReactant} 
              disabled={isAnalyzing || !newReactant.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Liste des réactifs personnalisés */}
          {customReactants.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customReactants.map((r, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="bg-orange-50 border-orange-200 text-orange-700 flex items-center gap-1"
                >
                  {r.name}
                  <button 
                    onClick={() => removeCustomReactant(i)}
                    className="ml-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        {/* Légende */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>Critique</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span>Dangereux</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-400" />
            <span>Précaution</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>Compatible</span>
          </div>
        </div>
        
        {/* Matrice visuelle */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left"></th>
                {classifiedSubstances.map((s, i) => (
                  <th key={i} className="p-2 text-center max-w-20 truncate" title={s.name}>
                    {s.name?.substring(0, 10)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classifiedSubstances.map((s1, i) => (
                <tr key={i}>
                  <td className="p-2 font-medium max-w-24 truncate" title={s1.name}>
                    {s1.name?.substring(0, 12)}...
                  </td>
                  {classifiedSubstances.map((s2, j) => (
                    <td key={j} className="p-1">
                      <button
                        onClick={() => i !== j && setSelectedCell({ i, j, ...matrix[i][j] })}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${getLevelColor(matrix[i][j]?.level)}`}
                        disabled={i === j}
                      >
                        {getLevelIcon(matrix[i][j]?.level)}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Détail sélection */}
        {selectedCell && selectedCell.incompatibilities?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-50 rounded-lg"
          >
            <p className="font-semibold text-slate-800 mb-2">
              {classifiedSubstances[selectedCell.i].name} + {classifiedSubstances[selectedCell.j].name}
            </p>
            {selectedCell.incompatibilities.map((inc, k) => (
              <div key={k} className="text-sm text-slate-600 mb-1">
                <Badge className={`mr-2 ${
                  inc.level === 'critical' ? 'bg-red-100 text-red-700' :
                  inc.level === 'danger' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {inc.level}
                </Badge>
                {inc.reaction}
              </div>
            ))}
          </motion.div>
        )}
        
        {/* Alertes gaz dangereux */}
        {allGases.size > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ⚠️ Dégagements gazeux dangereux possibles
            </p>
            <div className="flex flex-wrap gap-2">
              {[...allGases].map((gas, i) => (
                <Badge key={i} className="bg-red-100 text-red-700">
                  {gas}
                  {gas === 'HCN' && ' (mortel)'}
                  {gas === 'H₂S' && ' (toxique)'}
                  {gas === 'Cl₂' && ' (toxique)'}
                  {gas === 'NH₃' && ' (irritant)'}
                  {gas === 'H₂' && ' (inflammable)'}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-red-600 mt-2">
              Manipulation sous sorbonne obligatoire. Détecteur de gaz recommandé.
            </p>
          </div>
        )}
        
        {/* Résumé des paires critiques avec alternatives */}
        {criticalPairs.length > 0 && (
          <div className="space-y-3">
            <p className="font-semibold text-slate-700">Paires incompatibles détectées :</p>
            {criticalPairs.map((pair, i) => (
              <div key={i} className={`p-4 rounded-lg text-sm ${
                pair.level === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-medium">{pair.sub1}</span>
                    <span className="mx-2">+</span>
                    <span className="font-medium">{pair.sub2}</span>
                    <span className="mx-2">→</span>
                    <span className={pair.level === 'critical' ? 'text-red-700' : 'text-orange-700'}>
                      {pair.incompatibilities[0]?.reaction}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => suggestAlternatives(pair)}
                    disabled={isAnalyzing}
                    className="gap-1 text-xs"
                  >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
                    Alternatives
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Résultat des alternatives suggérées */}
        {alternativesResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Alternatives pour {alternativesResult.pair.sub1} + {alternativesResult.pair.sub2}
              </h4>
              <button 
                onClick={() => setAlternativesResult(null)}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {alternativesResult.alternative_for_first && (
                <div className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-medium">Remplacer {alternativesResult.pair.sub1} par :</span>
                    <p className="text-emerald-700">{alternativesResult.alternative_for_first}</p>
                  </div>
                </div>
              )}
              {alternativesResult.alternative_for_second && (
                <div className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-medium">Remplacer {alternativesResult.pair.sub2} par :</span>
                    <p className="text-emerald-700">{alternativesResult.alternative_for_second}</p>
                  </div>
                </div>
              )}
              {alternativesResult.alternative_method && (
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-medium">Méthode alternative :</span>
                    <p className="text-emerald-700">{alternativesResult.alternative_method}</p>
                  </div>
                </div>
              )}
              {alternativesResult.safety_note && (
                <div className="mt-2 p-2 bg-amber-50 rounded text-amber-700 text-xs">
                  ⚠️ {alternativesResult.safety_note}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {criticalPairs.length === 0 && classifiedSubstances.length >= 2 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Aucune incompatibilité majeure détectée entre ces substances</span>
          </div>
        )}

        {classifiedSubstances.length < 2 && (
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-center text-slate-500">
            <p>Ajoutez au moins 2 réactifs pour voir la matrice d'incompatibilités</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}