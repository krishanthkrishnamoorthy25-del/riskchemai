import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function IncompatibilityMatrix({ substances = [] }) {
  const [selectedCell, setSelectedCell] = useState(null);
  
  if (!substances || substances.length < 2) {
    return null;
  }
  
  // Classifier toutes les substances
  const classifiedSubstances = substances.map(s => ({
    ...s,
    classes: classifySubstance(s)
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
        
        {/* Résumé des paires critiques */}
        {criticalPairs.length > 0 && (
          <div className="space-y-2">
            <p className="font-semibold text-slate-700">Paires incompatibles détectées :</p>
            {criticalPairs.map((pair, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${
                pair.level === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
              }`}>
                <span className="font-medium">{pair.sub1}</span>
                <span className="mx-2">+</span>
                <span className="font-medium">{pair.sub2}</span>
                <span className="mx-2">→</span>
                <span className={pair.level === 'critical' ? 'text-red-700' : 'text-orange-700'}>
                  {pair.incompatibilities[0]?.reaction}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {criticalPairs.length === 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Aucune incompatibilité majeure détectée entre ces substances</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}