import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, Shield, Ban } from 'lucide-react';

// Substances à risque explosif ou instables
const EXPLOSIVE_INDICATORS = {
  groups: [
    { pattern: 'peroxyde', risk: 'Peroxyde - Peut exploser sous choc ou chaleur' },
    { pattern: 'azide', risk: 'Azoture - Extrêmement sensible aux chocs' },
    { pattern: 'nitro', risk: 'Groupe nitro - Potentiel explosif' },
    { pattern: 'picr', risk: 'Acide picrique - Explosif sensible' },
    { pattern: 'fulmin', risk: 'Fulminate - Très instable' },
    { pattern: 'acetylure', risk: 'Acétylure - Explosif au contact' },
    { pattern: 'perchlor', risk: 'Perchlorate - Oxydant puissant, risque explosion' },
    { pattern: 'chlorate', risk: 'Chlorate - Risque explosion avec matières organiques' },
    { pattern: 'diazo', risk: 'Composé diazo - Thermiquement instable' }
  ],
  hCodes: ['H200', 'H201', 'H202', 'H203', 'H204', 'H205', 'H240', 'H241'],
  ghsClasses: ['GHS01']
};

// Mélanges à risque explosif
const EXPLOSIVE_MIXTURES = [
  {
    components: [['oxydant', 'peroxyde', 'nitrate', 'permanganate', 'chlorate'], ['réducteur', 'hydrazine', 'sulfite', 'soufre']],
    risk: 'Mélange oxydant/réducteur - Réaction violente possible',
    severity: 'critical'
  },
  {
    components: [['peroxyde'], ['acide']],
    risk: 'Peroxyde + acide - Décomposition violente',
    severity: 'critical'
  },
  {
    components: [['peroxyde'], ['métal', 'fer', 'cuivre', 'manganèse']],
    risk: 'Peroxyde + métal - Catalyse de décomposition explosive',
    severity: 'high'
  },
  {
    components: [['nitrate'], ['matière organique', 'sucre', 'cellulose', 'charbon']],
    risk: 'Nitrate + matière organique - Mélange potentiellement explosif',
    severity: 'high'
  },
  {
    components: [['éther'], ['peroxyde', 'oxygène']],
    risk: 'Éther exposé à l\'air - Formation de peroxydes explosifs',
    severity: 'high'
  }
];

export default function ExplosionRiskAlert({ substances = [] }) {
  if (!substances || substances.length === 0) return null;

  const risks = [];
  const substanceNames = substances.map(s => (s.name || '').toLowerCase());
  
  // Vérifier les indicateurs individuels
  substances.forEach(s => {
    const name = (s.name || '').toLowerCase();
    const hCodes = s.h_codes || [];
    const ghsClasses = s.ghs_classes || [];
    
    // Groupes fonctionnels à risque
    EXPLOSIVE_INDICATORS.groups.forEach(group => {
      if (name.includes(group.pattern)) {
        risks.push({
          type: 'substance',
          substance: s.name,
          risk: group.risk,
          severity: 'high'
        });
      }
    });
    
    // Codes H explosifs
    const hasExplosiveH = hCodes.some(h => 
      EXPLOSIVE_INDICATORS.hCodes.some(code => h.includes(code))
    );
    if (hasExplosiveH) {
      risks.push({
        type: 'classification',
        substance: s.name,
        risk: 'Classifié explosif selon GHS',
        severity: 'critical'
      });
    }
    
    // Pictogramme GHS01
    if (ghsClasses.includes('GHS01')) {
      risks.push({
        type: 'pictogram',
        substance: s.name,
        risk: 'Pictogramme GHS01 - Explosif',
        severity: 'critical'
      });
    }
  });
  
  // Vérifier les mélanges dangereux
  if (substances.length >= 2) {
    EXPLOSIVE_MIXTURES.forEach(mixture => {
      const hasFirst = substanceNames.some(name => 
        mixture.components[0].some(c => name.includes(c))
      );
      const hasSecond = substanceNames.some(name => 
        mixture.components[1].some(c => name.includes(c))
      );
      
      if (hasFirst && hasSecond) {
        risks.push({
          type: 'mixture',
          substance: 'Mélange',
          risk: mixture.risk,
          severity: mixture.severity
        });
      }
    });
  }

  if (risks.length === 0) return null;

  const hasCritical = risks.some(r => r.severity === 'critical');

  return (
    <Card className={`${hasCritical ? 'border-red-400 bg-red-50' : 'border-orange-300 bg-orange-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-lg ${hasCritical ? 'text-red-800' : 'text-orange-800'}`}>
          <Zap className="w-5 h-5" />
          ⚠️ RISQUE D'EXPLOSION DÉTECTÉ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCritical && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
            <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">DANGER CRITIQUE</p>
              <p className="text-sm text-red-700">
                Ces substances présentent un risque d'explosion. 
                Manipulation par personnel qualifié uniquement.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {risks.map((risk, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border flex items-start gap-3 ${
                risk.severity === 'critical' 
                  ? 'bg-red-100 border-red-300' 
                  : 'bg-orange-100 border-orange-300'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                risk.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    risk.severity === 'critical' ? 'text-red-800' : 'text-orange-800'
                  }`}>
                    {risk.substance}
                  </span>
                  <Badge className={
                    risk.severity === 'critical' 
                      ? 'bg-red-200 text-red-800' 
                      : 'bg-orange-200 text-orange-800'
                  }>
                    {risk.type === 'mixture' ? 'Mélange' : 'Substance'}
                  </Badge>
                </div>
                <p className={`text-sm mt-1 ${
                  risk.severity === 'critical' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  {risk.risk}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-lg border ${hasCritical ? 'bg-white border-red-200' : 'bg-white border-orange-200'}`}>
          <p className={`font-semibold mb-2 flex items-center gap-2 ${hasCritical ? 'text-red-800' : 'text-orange-800'}`}>
            <Shield className="w-5 h-5" />
            Mesures de sécurité obligatoires
          </p>
          <ul className={`text-sm space-y-1 ${hasCritical ? 'text-red-700' : 'text-orange-700'}`}>
            <li>• Quantités minimales uniquement</li>
            <li>• Écran de protection anti-explosion</li>
            <li>• Pas de sources de chaleur, friction ou choc</li>
            <li>• Zone de travail dégagée</li>
            <li>• Équipement de protection complet (visière, gants épais)</li>
            {hasCritical && <li>• <strong>Consultation expert obligatoire avant manipulation</strong></li>}
          </ul>
        </div>

        <p className="text-xs text-center text-slate-500">
          ⚠️ Ce système ne remplace pas l'évaluation par un expert en pyrotechnie ou sécurité des procédés.
          Aucun détail de synthèse n'est fourni conformément à la réglementation.
        </p>
      </CardContent>
    </Card>
  );
}