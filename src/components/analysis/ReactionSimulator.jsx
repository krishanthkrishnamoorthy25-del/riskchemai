import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FlaskConical, 
  Dna, 
  AlertTriangle, 
  Loader2, 
  ArrowRight,
  Thermometer,
  Beaker,
  Shield,
  Zap
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReactionSimulator() {
  const [activeTab, setActiveTab] = useState('chemistry');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);
  
  // Chemistry state
  const [reactants, setReactants] = useState('');
  const [conditions, setConditions] = useState('');
  
  // Biotech state
  const [organism, setOrganism] = useState('');
  const [process, setProcess] = useState('');
  const [substrate, setSubstrate] = useState('');

  const simulateChemistry = async () => {
    if (!reactants.trim()) return;
    
    setIsSimulating(true);
    setResult(null);

    const prompt = `Tu es un expert en chimie et sécurité. Analyse cette réaction chimique potentielle:

RÉACTIFS: ${reactants}
CONDITIONS: ${conditions || 'Conditions standard (température ambiante, pression atmosphérique)'}

FOURNIS UNE ANALYSE DE SÉCURITÉ UNIQUEMENT (pas de protocole):

1. Identifie les produits probables de la réaction
2. Évalue les RISQUES de cette réaction:
   - Exothermicité / dégagement de chaleur
   - Gaz toxiques potentiels
   - Risque d'explosion ou d'emballement
   - Incompatibilités dangereuses
3. Classe le niveau de danger global (faible/modéré/élevé/critique)
4. Liste les EPI obligatoires
5. Précautions essentielles

IMPORTANT: NE FOURNIS AUCUN protocole, quantité, température précise ou étape de manipulation.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            reactants_identified: { type: "array", items: { type: "string" } },
            products_expected: { type: "array", items: { type: "string" } },
            reaction_type: { type: "string" },
            danger_level: { type: "string", enum: ["faible", "modéré", "élevé", "critique"] },
            risks: {
              type: "object",
              properties: {
                exothermic: { type: "boolean" },
                toxic_gases: { type: "array", items: { type: "string" } },
                explosion_risk: { type: "boolean" },
                incompatibilities: { type: "array", items: { type: "string" } }
              }
            },
            required_ppe: { type: "array", items: { type: "string" } },
            precautions: { type: "array", items: { type: "string" } },
            safety_summary: { type: "string" }
          }
        }
      });

      setResult({ type: 'chemistry', data: response });
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const simulateBiotech = async () => {
    if (!organism.trim() && !process.trim()) return;
    
    setIsSimulating(true);
    setResult(null);

    const prompt = `Tu es un expert en biotechnologie et biosécurité. Analyse ce processus biotechnologique:

ORGANISME/CELLULES: ${organism || 'Non spécifié'}
PROCESSUS: ${process}
SUBSTRAT/MILIEU: ${substrate || 'Non spécifié'}

FOURNIS UNE ANALYSE DE BIOSÉCURITÉ:

1. Identifie le type de processus (fermentation, culture cellulaire, transformation génétique, etc.)
2. Évalue les RISQUES biologiques:
   - Niveau de biosécurité requis (BSL-1 à BSL-4)
   - Risques de contamination
   - Pathogénicité potentielle
   - Risques environnementaux (OGM, dissémination)
3. Liste les équipements de confinement nécessaires
4. EPI spécifiques à la manipulation biologique
5. Procédures de décontamination recommandées

IMPORTANT: NE FOURNIS AUCUN protocole détaillé de manipulation.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            process_type: { type: "string" },
            biosafety_level: { type: "string", enum: ["BSL-1", "BSL-2", "BSL-3", "BSL-4"] },
            organism_classification: { type: "string" },
            risks: {
              type: "object",
              properties: {
                contamination_risk: { type: "string" },
                pathogenicity: { type: "string" },
                environmental_risk: { type: "string" },
                gmo_considerations: { type: "string" }
              }
            },
            containment_equipment: { type: "array", items: { type: "string" } },
            required_ppe: { type: "array", items: { type: "string" } },
            decontamination: { type: "array", items: { type: "string" } },
            safety_summary: { type: "string" }
          }
        }
      });

      setResult({ type: 'biotech', data: response });
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getDangerColor = (level) => {
    switch(level) {
      case 'faible': return 'bg-green-100 text-green-700';
      case 'modéré': return 'bg-yellow-100 text-yellow-700';
      case 'élevé': return 'bg-orange-100 text-orange-700';
      case 'critique': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getBSLColor = (level) => {
    switch(level) {
      case 'BSL-1': return 'bg-green-100 text-green-700';
      case 'BSL-2': return 'bg-yellow-100 text-yellow-700';
      case 'BSL-3': return 'bg-orange-100 text-orange-700';
      case 'BSL-4': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-purple-600" />
          Simulateur de Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chemistry" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              Réaction Chimique
            </TabsTrigger>
            <TabsTrigger value="biotech" className="gap-2">
              <Dna className="w-4 h-4" />
              Biotechnologie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chemistry" className="space-y-4">
            <div>
              <Label>Réactifs (séparés par +)</Label>
              <Input
                placeholder="Ex: H2SO4 + NaOH ou Acide sulfurique + Soude"
                value={reactants}
                onChange={(e) => setReactants(e.target.value)}
              />
            </div>
            <div>
              <Label>Conditions (optionnel)</Label>
              <Input
                placeholder="Ex: Chauffage, catalyseur, solvant..."
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
            </div>
            <Button 
              onClick={simulateChemistry}
              disabled={isSimulating || !reactants.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Beaker className="w-4 h-4 mr-2" />
                  Analyser les risques
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="biotech" className="space-y-4">
            <div>
              <Label>Organisme / Cellules</Label>
              <Input
                placeholder="Ex: E. coli, cellules HEK293, levure S. cerevisiae"
                value={organism}
                onChange={(e) => setOrganism(e.target.value)}
              />
            </div>
            <div>
              <Label>Type de processus</Label>
              <Input
                placeholder="Ex: Fermentation, culture cellulaire, transformation génétique"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
              />
            </div>
            <div>
              <Label>Substrat / Milieu (optionnel)</Label>
              <Input
                placeholder="Ex: Glucose, milieu LB, DMEM"
                value={substrate}
                onChange={(e) => setSubstrate(e.target.value)}
              />
            </div>
            <Button 
              onClick={simulateBiotech}
              disabled={isSimulating || (!organism.trim() && !process.trim())}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Dna className="w-4 h-4 mr-2" />
                  Analyser la biosécurité
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Résultats */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 space-y-4"
            >
              {/* Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Cette simulation est indicative. Consultez un expert HSE pour toute manipulation réelle.
                </p>
              </div>

              {result.type === 'chemistry' && result.data && (
                <div className="space-y-4">
                  {/* Niveau de danger */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="font-medium">Niveau de danger</span>
                    <Badge className={getDangerColor(result.data.danger_level)}>
                      {result.data.danger_level?.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Réaction */}
                  {result.data.reactants_identified?.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">Réaction identifiée</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {result.data.reactants_identified.map((r, i) => (
                          <React.Fragment key={i}>
                            <Badge variant="outline">{r}</Badge>
                            {i < result.data.reactants_identified.length - 1 && <span>+</span>}
                          </React.Fragment>
                        ))}
                        {result.data.products_expected?.length > 0 && (
                          <>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            {result.data.products_expected.map((p, i) => (
                              <React.Fragment key={i}>
                                <Badge className="bg-blue-100 text-blue-700">{p}</Badge>
                                {i < result.data.products_expected.length - 1 && <span>+</span>}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Risques */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">⚠️ Risques identifiés</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {result.data.risks?.exothermic && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-600" />
                          <span>Réaction exothermique</span>
                        </div>
                      )}
                      {result.data.risks?.explosion_risk && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Risque d'explosion</span>
                        </div>
                      )}
                    </div>
                    {result.data.risks?.toxic_gases?.length > 0 && (
                      <p className="mt-2 text-sm text-red-700">
                        Gaz toxiques: {result.data.risks.toxic_gases.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* EPI */}
                  {result.data.required_ppe?.length > 0 && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> EPI requis
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.data.required_ppe.map((ppe, i) => (
                          <Badge key={i} variant="outline" className="bg-white">{ppe}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Résumé */}
                  {result.data.safety_summary && (
                    <p className="text-sm text-slate-600 p-4 bg-slate-50 rounded-lg">
                      {result.data.safety_summary}
                    </p>
                  )}
                </div>
              )}

              {result.type === 'biotech' && result.data && (
                <div className="space-y-4">
                  {/* Niveau BSL */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="font-medium">Niveau de biosécurité</span>
                    <Badge className={getBSLColor(result.data.biosafety_level)}>
                      {result.data.biosafety_level}
                    </Badge>
                  </div>

                  {/* Type de processus */}
                  {result.data.process_type && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 mb-1">Type de processus</p>
                      <p className="text-sm text-purple-700">{result.data.process_type}</p>
                    </div>
                  )}

                  {/* Risques biologiques */}
                  {result.data.risks && (
                    <div className="p-4 bg-red-50 rounded-lg space-y-2">
                      <p className="text-sm font-medium text-red-800">⚠️ Risques biologiques</p>
                      {result.data.risks.contamination_risk && (
                        <p className="text-sm text-red-700">• Contamination: {result.data.risks.contamination_risk}</p>
                      )}
                      {result.data.risks.pathogenicity && (
                        <p className="text-sm text-red-700">• Pathogénicité: {result.data.risks.pathogenicity}</p>
                      )}
                      {result.data.risks.environmental_risk && (
                        <p className="text-sm text-red-700">• Environnement: {result.data.risks.environmental_risk}</p>
                      )}
                    </div>
                  )}

                  {/* Équipements de confinement */}
                  {result.data.containment_equipment?.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">🔬 Équipements de confinement</p>
                      <div className="flex flex-wrap gap-2">
                        {result.data.containment_equipment.map((eq, i) => (
                          <Badge key={i} variant="outline" className="bg-white">{eq}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Décontamination */}
                  {result.data.decontamination?.length > 0 && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800 mb-2">🧹 Décontamination</p>
                      <ul className="text-sm text-emerald-700 space-y-1">
                        {result.data.decontamination.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Résumé */}
                  {result.data.safety_summary && (
                    <p className="text-sm text-slate-600 p-4 bg-slate-50 rounded-lg">
                      {result.data.safety_summary}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}