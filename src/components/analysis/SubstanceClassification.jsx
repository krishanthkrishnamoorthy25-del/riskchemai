import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, Droplets, Skull, AlertTriangle, 
  Activity, Leaf, Sparkles, Shield
} from 'lucide-react';

const CLASSIFICATIONS = [
  {
    id: 'inflammable',
    label: 'Inflammable',
    icon: Flame,
    color: 'bg-red-100 text-red-700 border-red-200',
    iconColor: 'text-red-500',
    ghsCodes: ['GHS02'],
    hCodePatterns: ['H220', 'H221', 'H222', 'H223', 'H224', 'H225', 'H226', 'H227', 'H228']
  },
  {
    id: 'corrosif',
    label: 'Corrosif',
    icon: Droplets,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    iconColor: 'text-orange-500',
    ghsCodes: ['GHS05'],
    hCodePatterns: ['H290', 'H314', 'H318']
  },
  {
    id: 'toxique',
    label: 'Toxique',
    icon: Skull,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    iconColor: 'text-purple-500',
    ghsCodes: ['GHS06'],
    hCodePatterns: ['H300', 'H301', 'H310', 'H311', 'H330', 'H331']
  },
  {
    id: 'irritant',
    label: 'Irritant',
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    iconColor: 'text-yellow-500',
    ghsCodes: ['GHS07'],
    hCodePatterns: ['H302', 'H312', 'H315', 'H319', 'H332', 'H335', 'H336']
  },
  {
    id: 'cancerogene',
    label: 'CMR',
    icon: Activity,
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    iconColor: 'text-pink-500',
    ghsCodes: ['GHS08'],
    hCodePatterns: ['H340', 'H341', 'H350', 'H351', 'H360', 'H361', 'H370', 'H371', 'H372', 'H373']
  },
  {
    id: 'oxydant',
    label: 'Oxydant',
    icon: Sparkles,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-500',
    ghsCodes: ['GHS03'],
    hCodePatterns: ['H270', 'H271', 'H272']
  },
  {
    id: 'environnement',
    label: 'Danger aquatique',
    icon: Leaf,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-500',
    ghsCodes: ['GHS09'],
    hCodePatterns: ['H400', 'H410', 'H411', 'H412', 'H413']
  },
  {
    id: 'sensibilisant',
    label: 'Sensibilisant',
    icon: Shield,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-500',
    ghsCodes: [],
    hCodePatterns: ['H317', 'H334']
  }
];

export default function SubstanceClassification({ substances = [] }) {
  if (!substances || substances.length === 0) return null;

  // Classifier chaque substance
  const classifiedSubstances = substances.map(substance => {
    const ghsCodes = substance.ghs_classes || [];
    const hCodes = substance.h_codes || [];
    
    const classifications = CLASSIFICATIONS.filter(classif => {
      // Vérifier les codes GHS
      const hasGhs = classif.ghsCodes.some(code => ghsCodes.includes(code));
      
      // Vérifier les codes H
      const hasHCode = hCodes.some(h => 
        classif.hCodePatterns.some(pattern => h.includes(pattern))
      );
      
      return hasGhs || hasHCode;
    });

    return {
      ...substance,
      classifications
    };
  });

  // Compter les occurrences par classification
  const classificationCounts = CLASSIFICATIONS.map(classif => {
    const count = classifiedSubstances.filter(s => 
      s.classifications.some(c => c.id === classif.id)
    ).length;
    return { ...classif, count };
  }).filter(c => c.count > 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-600" />
          Classification des produits
        </CardTitle>
        <p className="text-sm text-slate-500">
          Catégorisation selon le SGH/CLP
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé global */}
        <div className="flex flex-wrap gap-2">
          {classificationCounts.map(classif => (
            <div 
              key={classif.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${classif.color}`}
            >
              <classif.icon className={`w-4 h-4 ${classif.iconColor}`} />
              <span className="font-medium">{classif.label}</span>
              <Badge variant="outline" className="ml-1">
                {classif.count}
              </Badge>
            </div>
          ))}
        </div>

        {/* Détail par substance */}
        <div className="space-y-3">
          {classifiedSubstances.map((substance, index) => (
            <div 
              key={index}
              className="p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-800">{substance.name}</p>
                  {substance.cas && (
                    <p className="text-xs text-slate-500">CAS: {substance.cas}</p>
                  )}
                </div>
                <div className="text-right">
                  {substance.confidence_score && (
                    <Badge variant="outline" className="text-xs">
                      Confiance: {Math.round(substance.confidence_score * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
              
              {substance.classifications.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {substance.classifications.map(classif => (
                    <div 
                      key={classif.id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${classif.color}`}
                    >
                      <classif.icon className={`w-3 h-3 ${classif.iconColor}`} />
                      <span>{classif.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-2">
                  Aucune classification de danger identifiée
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-xs text-slate-600 mb-2 font-medium">Légende des classifications :</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-500">
            <div><strong>CMR</strong> = Cancérogène, Mutagène, Reprotoxique</div>
            <div><strong>GHS</strong> = Système Général Harmonisé</div>
            <div><strong>Codes H</strong> = Mentions de danger</div>
            <div><strong>CLP</strong> = Classification, Labelling, Packaging</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}