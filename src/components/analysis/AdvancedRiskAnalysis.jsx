import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Thermometer, Wind, Droplets, Flame, AlertTriangle,
  Shield, Beaker, Activity, CheckCircle2, XCircle,
  Gauge, Zap, CloudRain
} from 'lucide-react';

export default function AdvancedRiskAnalysis({ substances = [], analysisData = null }) {
  if (!substances || substances.length === 0) return null;

  // Calculer les scores de risque
  const calculateRiskScores = () => {
    let exothermicRisk = 0;
    let gasRisk = 0;
    let explosionRisk = 0;
    let corrosionRisk = 0;
    let toxicRisk = 0;
    let fireRisk = 0;
    let polymerizationRisk = 0;
    let environmentRisk = 0;

    substances.forEach(s => {
      const hCodes = s.h_codes || [];
      const ghsClasses = s.ghs_classes || [];
      const name = (s.name || '').toLowerCase();

      // Risque exothermique
      if (ghsClasses.includes('GHS03') || name.includes('peroxyde')) exothermicRisk += 30;
      if (hCodes.some(h => h.includes('H200') || h.includes('H201'))) exothermicRisk += 40;
      
      // Risque dégagement gazeux
      if (hCodes.some(h => h.includes('H280') || h.includes('H281'))) gasRisk += 30;
      if (name.includes('acide') && substances.some(x => x.name?.toLowerCase().includes('métal'))) gasRisk += 40;
      if (name.includes('hypochlorite') && substances.some(x => x.name?.toLowerCase().includes('acide'))) gasRisk += 50;
      
      // Risque explosion
      if (ghsClasses.includes('GHS01')) explosionRisk += 50;
      if (hCodes.some(h => h.includes('H200') || h.includes('H201') || h.includes('H202'))) explosionRisk += 30;
      if (name.includes('nitro') || name.includes('azide') || name.includes('peroxyde')) explosionRisk += 25;
      
      // Risque corrosion
      if (ghsClasses.includes('GHS05')) corrosionRisk += 40;
      if (hCodes.some(h => h.includes('H314') || h.includes('H318'))) corrosionRisk += 30;
      
      // Risque toxique
      if (ghsClasses.includes('GHS06')) toxicRisk += 50;
      if (ghsClasses.includes('GHS08')) toxicRisk += 40;
      if (hCodes.some(h => h.includes('H300') || h.includes('H310') || h.includes('H330'))) toxicRisk += 30;
      
      // Risque incendie
      if (ghsClasses.includes('GHS02')) fireRisk += 40;
      if (hCodes.some(h => h.includes('H220') || h.includes('H224') || h.includes('H225'))) fireRisk += 30;
      
      // Risque polymérisation
      if (name.includes('styrène') || name.includes('acryl') || name.includes('vinyl')) polymerizationRisk += 40;
      if (hCodes.some(h => h.includes('H420'))) polymerizationRisk += 30;
      
      // Risque environnemental
      if (ghsClasses.includes('GHS09')) environmentRisk += 50;
      if (hCodes.some(h => h.includes('H400') || h.includes('H410') || h.includes('H411'))) environmentRisk += 30;
    });

    // Interactions dangereuses
    const hasAcid = substances.some(s => s.name?.toLowerCase().includes('acide'));
    const hasBase = substances.some(s => s.name?.toLowerCase().includes('hydroxyde') || s.name?.toLowerCase().includes('soude'));
    const hasOxidizer = substances.some(s => (s.ghs_classes || []).includes('GHS03'));
    const hasReducer = substances.some(s => s.name?.toLowerCase().includes('sulfite') || s.name?.toLowerCase().includes('hydrazine'));
    const hasFlammable = substances.some(s => (s.ghs_classes || []).includes('GHS02'));

    if (hasAcid && hasBase) {
      exothermicRisk += 40;
      gasRisk += 30;
    }
    if (hasOxidizer && hasReducer) {
      exothermicRisk += 50;
      explosionRisk += 40;
    }
    if (hasOxidizer && hasFlammable) {
      fireRisk += 50;
      explosionRisk += 40;
    }

    return {
      exothermic: Math.min(100, exothermicRisk),
      gas: Math.min(100, gasRisk),
      explosion: Math.min(100, explosionRisk),
      corrosion: Math.min(100, corrosionRisk),
      toxic: Math.min(100, toxicRisk),
      fire: Math.min(100, fireRisk),
      polymerization: Math.min(100, polymerizationRisk),
      environment: Math.min(100, environmentRisk)
    };
  };

  // Estimer le pH du mélange
  const estimatePH = () => {
    let acidCount = 0;
    let baseCount = 0;
    let strongAcid = false;
    let strongBase = false;

    substances.forEach(s => {
      const name = (s.name || '').toLowerCase();
      if (name.includes('acide sulfurique') || name.includes('acide chlorhydrique') || name.includes('acide nitrique')) {
        acidCount += 3;
        strongAcid = true;
      } else if (name.includes('acide')) {
        acidCount += 1;
      }
      if (name.includes('soude') || name.includes('hydroxyde de sodium') || name.includes('hydroxyde de potassium')) {
        baseCount += 3;
        strongBase = true;
      } else if (name.includes('hydroxyde') || name.includes('ammoniaque')) {
        baseCount += 1;
      }
    });

    if (acidCount === 0 && baseCount === 0) return { value: '~7', label: 'Neutre', color: 'bg-green-500' };
    if (acidCount > baseCount) {
      if (strongAcid) return { value: '<2', label: 'Très acide', color: 'bg-red-500' };
      return { value: '3-5', label: 'Acide', color: 'bg-orange-500' };
    }
    if (baseCount > acidCount) {
      if (strongBase) return { value: '>12', label: 'Très basique', color: 'bg-purple-500' };
      return { value: '9-11', label: 'Basique', color: 'bg-blue-500' };
    }
    return { value: '~7', label: 'Neutralisé', color: 'bg-green-500' };
  };

  // Stabilité thermique
  const getThermalStability = () => {
    let unstable = false;
    let reasons = [];

    substances.forEach(s => {
      const name = (s.name || '').toLowerCase();
      const hCodes = s.h_codes || [];
      
      if (name.includes('peroxyde')) {
        unstable = true;
        reasons.push('Peroxydes thermiquement instables');
      }
      if (name.includes('nitro') || name.includes('azide')) {
        unstable = true;
        reasons.push('Composés nitro/azide sensibles à la chaleur');
      }
      if (hCodes.some(h => h.includes('H240') || h.includes('H241'))) {
        unstable = true;
        reasons.push('Peut exploser sous l\'effet de la chaleur');
      }
    });

    if (unstable) {
      return { level: 'instable', color: 'text-red-600', reasons };
    }
    return { level: 'stable', color: 'text-green-600', reasons: ['Pas de risque thermique particulier identifié'] };
  };

  const risks = calculateRiskScores();
  const ph = estimatePH();
  const thermal = getThermalStability();

  const getRiskColor = (value) => {
    if (value >= 70) return 'bg-red-500';
    if (value >= 40) return 'bg-orange-500';
    if (value >= 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLabel = (value) => {
    if (value >= 70) return 'Critique';
    if (value >= 40) return 'Élevé';
    if (value >= 20) return 'Modéré';
    return 'Faible';
  };

  const riskItems = [
    { key: 'exothermic', label: 'Exothermicité', icon: Thermometer, value: risks.exothermic },
    { key: 'gas', label: 'Dégagement gazeux', icon: Wind, value: risks.gas },
    { key: 'explosion', label: 'Explosion', icon: Zap, value: risks.explosion },
    { key: 'fire', label: 'Incendie', icon: Flame, value: risks.fire },
    { key: 'toxic', label: 'Toxicité', icon: AlertTriangle, value: risks.toxic },
    { key: 'corrosion', label: 'Corrosion', icon: Droplets, value: risks.corrosion },
    { key: 'polymerization', label: 'Polymérisation', icon: Activity, value: risks.polymerization },
    { key: 'environment', label: 'Environnement', icon: CloudRain, value: risks.environment }
  ];

  const globalRisk = Math.round(Object.values(risks).reduce((a, b) => a + b, 0) / Object.keys(risks).length);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="w-5 h-5 text-indigo-600" />
          Analyse de Risques Avancée
        </CardTitle>
        <p className="text-sm text-slate-500">
          Évaluation multi-critères basée sur {substances.length} substance(s)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score global */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700">Score de risque global</span>
            <Badge className={`${getRiskColor(globalRisk)} text-white`}>
              {getRiskLabel(globalRisk)} ({globalRisk}%)
            </Badge>
          </div>
          <Progress value={globalRisk} className="h-3" />
        </div>

        {/* Grille des risques */}
        <div className="grid md:grid-cols-2 gap-4">
          {riskItems.map(item => (
            <div key={item.key} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.value >= 40 ? 'text-red-500' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.value >= 70 ? 'text-red-600' : item.value >= 40 ? 'text-orange-600' : 'text-slate-600'}`}>
                  {item.value}%
                </span>
              </div>
              <Progress value={item.value} className={`h-2 ${getRiskColor(item.value)}`} />
            </div>
          ))}
        </div>

        {/* Propriétés du mélange */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* pH estimé */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">pH estimé</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${ph.color} text-white`}>
              <Droplets className="w-4 h-4" />
              <span className="font-bold">{ph.value}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{ph.label}</p>
          </div>

          {/* Stabilité thermique */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">Stabilité thermique</p>
            <div className={`flex items-center justify-center gap-2 ${thermal.color}`}>
              {thermal.level === 'stable' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-bold capitalize">{thermal.level}</span>
            </div>
          </div>

          {/* Volatilité */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-1">Volatilité</p>
            <div className="flex items-center justify-center gap-2">
              <Wind className={`w-5 h-5 ${
                substances.some(s => s.name?.toLowerCase().includes('éther') || s.name?.toLowerCase().includes('acétone'))
                  ? 'text-orange-500' : 'text-green-500'
              }`} />
              <span className="font-bold">
                {substances.some(s => s.name?.toLowerCase().includes('éther') || s.name?.toLowerCase().includes('acétone'))
                  ? 'Élevée' : 'Modérée'}
              </span>
            </div>
          </div>
        </div>

        {/* Alertes critiques */}
        {(risks.explosion >= 40 || risks.toxic >= 50 || risks.gas >= 40) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertes critiques
            </p>
            <ul className="space-y-1 text-sm text-red-700">
              {risks.explosion >= 40 && <li>• Risque d'explosion détecté - Manipulation en zone ATEX</li>}
              {risks.toxic >= 50 && <li>• Toxicité élevée - Protection respiratoire obligatoire</li>}
              {risks.gas >= 40 && <li>• Dégagement gazeux probable - Sorbonne obligatoire</li>}
              {thermal.level === 'instable' && thermal.reasons.map((r, i) => <li key={i}>• {r}</li>)}
            </ul>
          </div>
        )}

        {/* Recommandation validation expert */}
        {globalRisk >= 50 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Validation expert requise</p>
              <p className="text-sm text-amber-700">
                Score de risque élevé ({globalRisk}%). Une validation par un responsable HSE 
                est fortement recommandée avant toute manipulation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}