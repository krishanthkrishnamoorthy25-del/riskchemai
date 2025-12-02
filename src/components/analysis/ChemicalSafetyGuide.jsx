import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wind, Thermometer, Beaker, Package, AlertTriangle, 
  Shield, Droplets, Flame, ChevronDown, ChevronUp,
  Copy, Check, FlaskConical, Skull, Leaf
} from 'lucide-react';
import { toast } from 'sonner';

export default function ChemicalSafetyGuide({ substances = [], analysisData = null }) {
  const [expandedSections, setExpandedSections] = useState({
    ventilation: true,
    ordre: true,
    temperature: true,
    materiaux: true,
    stockage: true,
    urgence: true
  });
  const [copied, setCopied] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = () => {
    const text = generateTextGuide();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Guide copié dans le presse-papiers');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateTextGuide = () => {
    return `GUIDE DE MANIPULATION SÉCURISÉE
================================
Généré le ${new Date().toLocaleDateString('fr-FR')}

SUBSTANCES CONCERNÉES:
${substances.map(s => `- ${s.name} (CAS: ${s.cas || 'N/A'})`).join('\n')}

VENTILATION:
${getVentilationRecommendations().join('\n')}

ORDRE D'AJOUT RECOMMANDÉ:
${getAdditionOrder().map((s, i) => `${i+1}. ${s}`).join('\n')}

TEMPÉRATURE:
${getTemperatureRecommendations().join('\n')}

MATÉRIAUX:
À utiliser: ${getMaterialsToUse().join(', ')}
À éviter: ${getMaterialsToAvoid().join(', ')}

STOCKAGE:
${getStorageRecommendations().join('\n')}

---
Document généré par ChemRisk AI - Usage interne uniquement
Validation par un responsable sécurité obligatoire
    `;
  };

  // Analyse des substances pour recommandations
  const hasAcids = substances.some(s => 
    s.name?.toLowerCase().includes('acide') || 
    s.name?.toLowerCase().includes('acid') ||
    (s.h_codes || []).some(h => h.includes('H314') || h.includes('H290'))
  );

  const hasBases = substances.some(s => 
    s.name?.toLowerCase().includes('hydroxyde') || 
    s.name?.toLowerCase().includes('soude') ||
    s.name?.toLowerCase().includes('ammoni')
  );

  const hasOxidizers = substances.some(s => 
    (s.ghs_classes || []).includes('GHS03') ||
    s.name?.toLowerCase().includes('peroxyde') ||
    s.name?.toLowerCase().includes('nitrate')
  );

  const hasFlammables = substances.some(s => 
    (s.ghs_classes || []).includes('GHS02') ||
    s.name?.toLowerCase().includes('éthanol') ||
    s.name?.toLowerCase().includes('acétone')
  );

  const hasVolatiles = substances.some(s =>
    s.name?.toLowerCase().includes('éther') ||
    s.name?.toLowerCase().includes('acétone') ||
    s.name?.toLowerCase().includes('chloroforme')
  );

  const hasToxics = substances.some(s =>
    (s.ghs_classes || []).includes('GHS06') ||
    (s.ghs_classes || []).includes('GHS08')
  );

  const getVentilationRecommendations = () => {
    const recs = [];
    if (hasVolatiles) recs.push('• Sorbonne obligatoire (substances volatiles détectées)');
    if (hasToxics) recs.push('• Hotte aspirante avec filtration spécifique');
    if (hasAcids && hasBases) recs.push('• Ventilation renforcée (risque dégagement gazeux acide/base)');
    if (hasFlammables) recs.push('• Zone ATEX si concentration vapeurs > 10% LIE');
    if (recs.length === 0) recs.push('• Ventilation générale suffisante');
    recs.push('• Vérifier le tirage avant manipulation');
    return recs;
  };

  const getAdditionOrder = () => {
    const order = [];
    // Règle générale : solvant d'abord, puis réactifs du moins dangereux au plus dangereux
    const sorted = [...substances].sort((a, b) => {
      const dangerA = (a.ghs_classes || []).length;
      const dangerB = (b.ghs_classes || []).length;
      return dangerA - dangerB;
    });

    if (hasAcids && substances.some(s => s.name?.toLowerCase().includes('eau'))) {
      order.push('⚠️ TOUJOURS ajouter l\'acide dans l\'eau, JAMAIS l\'inverse');
    }

    sorted.forEach(s => {
      order.push(`${s.name}${s.role ? ` (${s.role})` : ''}`);
    });

    return order;
  };

  const getTemperatureRecommendations = () => {
    const recs = [];
    if (hasOxidizers) recs.push('• Maintenir < 25°C (oxydants présents)');
    if (hasFlammables) recs.push('• Éviter sources de chaleur > point éclair');
    if (hasAcids && hasBases) recs.push('• Contrôler température (réaction exothermique possible)');
    recs.push('• Utiliser un bain thermostaté si nécessaire');
    recs.push('• Surveiller la température pendant l\'ajout');
    return recs;
  };

  const getMaterialsToUse = () => {
    const mats = ['Verre borosilicate'];
    if (hasAcids) mats.push('PTFE', 'Téflon');
    if (hasBases) mats.push('Polypropylène', 'HDPE');
    if (!hasOxidizers) mats.push('Inox 316L');
    return mats;
  };

  const getMaterialsToAvoid = () => {
    const avoid = [];
    if (hasAcids) avoid.push('Métaux réactifs', 'Aluminium');
    if (hasBases) avoid.push('Aluminium', 'Zinc');
    if (hasOxidizers) avoid.push('Matières organiques', 'Bois', 'Papier');
    if (hasFlammables) avoid.push('Sources d\'ignition');
    if (avoid.length === 0) avoid.push('Aucune restriction particulière');
    return avoid;
  };

  const getStorageRecommendations = () => {
    const recs = [];
    if (hasAcids) recs.push('• Armoire acides ventilée');
    if (hasBases) recs.push('• Armoire bases séparée des acides');
    if (hasOxidizers) recs.push('• Armoire oxydants isolée');
    if (hasFlammables) recs.push('• Armoire anti-feu ventilée');
    if (hasToxics) recs.push('• Armoire fermée à clé, accès restreint');
    recs.push('• Étiquetage conforme GHS');
    recs.push('• Bacs de rétention obligatoires');
    return recs;
  };

  const Section = ({ id, title, icon: Icon, color, children }) => (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between p-4 ${color} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
        </div>
        {expandedSections[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expandedSections[id] && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  if (!substances || substances.length === 0) {
    return null;
  }

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
            <Shield className="w-5 h-5" />
            Guide de Manipulation Sécurisée
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié' : 'Copier'}
          </Button>
        </div>
        <p className="text-sm text-emerald-600">
          Recommandations basées sur l'analyse de {substances.length} substance(s)
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Alertes prioritaires */}
        {(hasAcids && hasBases) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Incompatibilité Acide/Base détectée</p>
              <p className="text-sm text-red-700">Risque de réaction violente et dégagement gazeux</p>
            </div>
          </div>
        )}

        {hasOxidizers && hasFlammables && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
            <Flame className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800">Risque d'incendie/explosion</p>
              <p className="text-sm text-orange-700">Oxydants + inflammables = mélange dangereux</p>
            </div>
          </div>
        )}

        <Section id="ventilation" title="Ventilation nécessaire" icon={Wind} color="bg-blue-50 hover:bg-blue-100 text-blue-800">
          <ul className="space-y-2 text-sm text-slate-700">
            {getVentilationRecommendations().map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </Section>

        <Section id="ordre" title="Ordre d'ajout recommandé" icon={FlaskConical} color="bg-purple-50 hover:bg-purple-100 text-purple-800">
          <ol className="space-y-2 text-sm text-slate-700">
            {getAdditionOrder().map((step, i) => (
              <li key={i} className={step.startsWith('⚠️') ? 'font-semibold text-red-700' : ''}>
                {step.startsWith('⚠️') ? step : `${i+1}. ${step}`}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="temperature" title="Température recommandée" icon={Thermometer} color="bg-orange-50 hover:bg-orange-100 text-orange-800">
          <ul className="space-y-2 text-sm text-slate-700">
            {getTemperatureRecommendations().map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </Section>

        <Section id="materiaux" title="Matériaux à utiliser / éviter" icon={Beaker} color="bg-slate-50 hover:bg-slate-100 text-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-green-700 mb-2">✓ À utiliser</p>
              <div className="flex flex-wrap gap-1">
                {getMaterialsToUse().map((mat, i) => (
                  <Badge key={i} className="bg-green-100 text-green-700">{mat}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-red-700 mb-2">✗ À éviter</p>
              <div className="flex flex-wrap gap-1">
                {getMaterialsToAvoid().map((mat, i) => (
                  <Badge key={i} className="bg-red-100 text-red-700">{mat}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="stockage" title="Stockage recommandé" icon={Package} color="bg-amber-50 hover:bg-amber-100 text-amber-800">
          <ul className="space-y-2 text-sm text-slate-700">
            {getStorageRecommendations().map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </Section>

        <Section id="urgence" title="En cas d'urgence" icon={Skull} color="bg-red-50 hover:bg-red-100 text-red-800">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Contact yeux : rincer 15 min à l'eau, consulter ophtalmologue</li>
            <li>• Contact peau : retirer vêtements contaminés, laver abondamment</li>
            <li>• Inhalation : quitter la zone, air frais, position semi-assise</li>
            <li>• Ingestion : NE PAS faire vomir, appeler le 15 ou centre antipoison</li>
            <li>• Déversement : absorber avec matériau inerte, ventiler</li>
            <li className="font-semibold text-red-700">📞 Centre Antipoison : 01 40 05 48 48</li>
          </ul>
        </Section>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <strong>⚠️ Avertissement :</strong> Ce guide est généré automatiquement à titre indicatif. 
          Il ne remplace pas les FDS officielles ni la validation par un responsable sécurité qualifié.
        </div>
      </CardContent>
    </Card>
  );
}