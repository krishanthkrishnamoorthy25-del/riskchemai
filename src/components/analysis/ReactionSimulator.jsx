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
  Zap,
  Plus,
  Trash2,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Snowflake,
  Flame
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReactionSimulator() {
  const [activeTab, setActiveTab] = useState('chemistry');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);
  const [needsConditions, setNeedsConditions] = useState(false);
  const [pendingReaction, setPendingReaction] = useState(null);
  
  // Chemistry state - multiple reactants with CAS
  const [reactants, setReactants] = useState([
    { name: '', cas: '' }
  ]);
  const [conditions, setConditions] = useState({
    temperature: '',
    pressure: '',
    solvent: '',
    catalyst: '',
    time: '',
    other: ''
  });
  
  // Biotech state
  const [organism, setOrganism] = useState('');
  const [process, setProcess] = useState('');
  const [substrate, setSubstrate] = useState('');
  const [biosafety, setBiosafety] = useState('');

  const addReactant = () => {
    setReactants([...reactants, { name: '', cas: '' }]);
  };

  const removeReactant = (index) => {
    if (reactants.length > 1) {
      setReactants(reactants.filter((_, i) => i !== index));
    }
  };

  const updateReactant = (index, field, value) => {
    const updated = [...reactants];
    updated[index][field] = value;
    setReactants(updated);
  };

  const simulateChemistry = async (withConditions = false) => {
    const validReactants = reactants.filter(r => r.name.trim() || r.cas.trim());
    if (validReactants.length === 0) return;
    
    setIsSimulating(true);
    setResult(null);
    setNeedsConditions(false);

    const reactantsList = validReactants.map(r => 
      r.cas ? `${r.name} (CAS: ${r.cas})` : r.name
    ).join(' + ');

    const conditionsText = withConditions ? `
CONDITIONS SPÉCIFIÉES:
- Température: ${conditions.temperature || 'Non spécifiée'}
- Pression: ${conditions.pressure || 'Atmosphérique'}
- Solvant: ${conditions.solvent || 'Aucun'}
- Catalyseur: ${conditions.catalyst || 'Aucun'}
- Durée: ${conditions.time || 'Non spécifiée'}
- Autres: ${conditions.other || 'Aucune'}` : '';

    const prompt = `Tu es un expert en chimie organique et inorganique. Analyse cette réaction chimique:

RÉACTIFS: ${reactantsList}
${conditionsText}

FOURNIS UNE ANALYSE COMPLÈTE:

1. IDENTIFICATION DES RÉACTIFS (recherche PubChem par CAS si fourni):
   - Nom exact, CAS vérifié, formule brute pour chaque réactif

2. TYPE DE RÉACTION:
   - Identifie le type (Diels-Alder, substitution nucléophile, addition, élimination, oxydoréduction, etc.)

3. PRODUITS DE RÉACTION - TRÈS IMPORTANT:
   Pour chaque produit possible, indique:
   - Nom, CAS, formule brute
   - Si c'est le produit MAJORITAIRE ou MINORITAIRE
   - Sous quelles CONDITIONS ce produit est favorisé
   
   Exemple Diels-Alder: précise quel isomère (endo/exo) est:
   - Produit cinétique (basse température) 
   - Produit thermodynamique (haute température)

4. CONDITIONS CRITIQUES:
   - Les conditions qui changent la sélectivité
   - Température optimale
   - Nécessité d'un catalyseur

5. RISQUES DE SÉCURITÉ - AVEC JUSTIFICATION OBLIGATOIRE:
   Pour CHAQUE risque identifié, fournis:
   - Le risque précis
   - La JUSTIFICATION chimique (pourquoi ce risque existe)
   - La RÉFÉRENCE ou SOURCE qui documente ce risque
   
   Exemple: "Acide fort + Base forte → Réaction exothermique (ΔH ≈ -57 kJ/mol pour neutralisation) - Source: Atkins Physical Chemistry"

6. RÉFÉRENCES SCIENTIFIQUES - OBLIGATOIRE:
   - Cite 2-3 publications ou sources fiables pour CHAQUE affirmation importante
   - Inclure: auteur/organisation, titre, année, DOI ou URL si disponible
   - Sources acceptées: PubChem, ECHA, INRS, ACS, RSC, Sigma-Aldrich SDS, manuels de référence (Atkins, March, Clayden)

IMPORTANT: Ne fournis AUCUN protocole détaillé de manipulation.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            reactants_identified: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cas: { type: "string" },
                  formula: { type: "string" }
                }
              }
            },
            reaction_type: { type: "string" },
            reaction_mechanism: { type: "string" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cas: { type: "string" },
                  formula: { type: "string" },
                  yield_type: { type: "string", enum: ["majoritaire", "minoritaire", "trace"] },
                  conditions_favoring: { type: "string" },
                  is_kinetic_product: { type: "boolean" },
                  is_thermodynamic_product: { type: "boolean" }
                }
              }
            },
            critical_conditions: {
              type: "object",
              properties: {
                temperature_effect: { type: "string" },
                optimal_temperature: { type: "string" },
                catalyst_needed: { type: "boolean" },
                catalyst_type: { type: "string" },
                selectivity_factors: { type: "array", items: { type: "string" } }
              }
            },
            needs_more_conditions: { type: "boolean" },
            conditions_needed: { type: "array", items: { type: "string" } },
            danger_level: { type: "string", enum: ["faible", "modéré", "élevé", "critique"] },
            risks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk_type: { type: "string" },
                  description: { type: "string" },
                  justification: { type: "string" },
                  severity: { type: "string", enum: ["faible", "modéré", "élevé", "critique"] },
                  reference: {
                    type: "object",
                    properties: {
                      source: { type: "string" },
                      detail: { type: "string" },
                      url: { type: "string" }
                    }
                  }
                }
              }
            },
            required_ppe: { type: "array", items: { type: "string" } },
            precautions: { type: "array", items: { type: "string" } },
            references: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  source: { type: "string" },
                  year: { type: "string" },
                  url: { type: "string" },
                  doi: { type: "string" }
                }
              }
            },
            safety_summary: { type: "string" }
          }
        }
      });

      // Check if more conditions are needed
      if (response.needs_more_conditions && !withConditions) {
        setNeedsConditions(true);
        setPendingReaction(response);
        setResult({ type: 'chemistry', data: response, partial: true });
      } else {
        setResult({ type: 'chemistry', data: response });
      }
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
NIVEAU BSL SUPPOSÉ: ${biosafety || 'À déterminer'}

FOURNIS UNE ANALYSE COMPLÈTE:

1. IDENTIFICATION:
   - Classification taxonomique de l'organisme
   - Souche si identifiable
   - Caractéristiques pertinentes (pathogénicité, OGM, etc.)

2. TYPE DE PROCESSUS:
   - Fermentation, culture cellulaire, transformation génétique, etc.
   - Produits attendus

3. ÉVALUATION BIOSÉCURITÉ:
   - Niveau BSL requis (1-4) avec justification
   - Risques de contamination
   - Risques environnementaux (dissémination OGM)

4. PRÉCAUTIONS SPÉCIFIQUES:
   - EPI requis
   - Équipements de confinement
   - Procédures de décontamination
   - Gestion des déchets

5. RÉFÉRENCES SCIENTIFIQUES:
   - Cite 2-3 publications ou guidelines officiels (CDC, OMS, INRS)
   - Inclure DOI ou URLs quand disponibles

IMPORTANT: Base-toi sur des sources fiables et officielles.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            organism_identification: {
              type: "object",
              properties: {
                scientific_name: { type: "string" },
                common_name: { type: "string" },
                strain: { type: "string" },
                classification: { type: "string" },
                is_gmo: { type: "boolean" },
                pathogenicity_class: { type: "string" }
              }
            },
            process_type: { type: "string" },
            expected_products: { type: "array", items: { type: "string" } },
            biosafety_level: { type: "string", enum: ["BSL-1", "BSL-2", "BSL-3", "BSL-4"] },
            biosafety_justification: { type: "string" },
            risks: {
              type: "object",
              properties: {
                contamination_risk: { type: "string" },
                pathogenicity: { type: "string" },
                environmental_risk: { type: "string" },
                gmo_considerations: { type: "string" },
                aerosol_risk: { type: "string" }
              }
            },
            containment_equipment: { type: "array", items: { type: "string" } },
            required_ppe: { type: "array", items: { type: "string" } },
            decontamination: {
              type: "object",
              properties: {
                methods: { type: "array", items: { type: "string" } },
                chemicals: { type: "array", items: { type: "string" } },
                waste_management: { type: "string" }
              }
            },
            precautions: { type: "array", items: { type: "string" } },
            references: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  source: { type: "string" },
                  year: { type: "string" },
                  url: { type: "string" },
                  doi: { type: "string" }
                }
              }
            },
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
          Simulateur de Réactions & Biosécurité
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
            {/* Reactants with CAS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Réactifs</Label>
                <Button type="button" variant="outline" size="sm" onClick={addReactant} className="gap-1">
                  <Plus className="w-3 h-3" /> Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {reactants.map((reactant, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Nom (ex: Butadiène)"
                      value={reactant.name}
                      onChange={(e) => updateReactant(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="CAS (ex: 106-99-0)"
                      value={reactant.cas}
                      onChange={(e) => updateReactant(index, 'cas', e.target.value)}
                      className="w-36"
                    />
                    {reactants.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeReactant(index)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions (collapsible) */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-slate-500" />
                <Label className="font-medium text-sm">Conditions réactionnelles (optionnel)</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-500">Température</Label>
                  <Input
                    placeholder="ex: 25°C, reflux, -78°C"
                    value={conditions.temperature}
                    onChange={(e) => setConditions({...conditions, temperature: e.target.value})}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Pression</Label>
                  <Input
                    placeholder="ex: 1 atm, sous vide"
                    value={conditions.pressure}
                    onChange={(e) => setConditions({...conditions, pressure: e.target.value})}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Solvant</Label>
                  <Input
                    placeholder="ex: THF, DCM, eau"
                    value={conditions.solvent}
                    onChange={(e) => setConditions({...conditions, solvent: e.target.value})}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Catalyseur</Label>
                  <Input
                    placeholder="ex: Pd/C, acide de Lewis"
                    value={conditions.catalyst}
                    onChange={(e) => setConditions({...conditions, catalyst: e.target.value})}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={() => simulateChemistry(false)}
              disabled={isSimulating || !reactants.some(r => r.name.trim() || r.cas.trim())}
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
                  Simuler la réaction
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="biotech" className="space-y-4">
            <div>
              <Label>Organisme / Cellules</Label>
              <Input
                placeholder="ex: E. coli K-12, cellules HEK293, S. cerevisiae"
                value={organism}
                onChange={(e) => setOrganism(e.target.value)}
              />
            </div>
            <div>
              <Label>Type de processus</Label>
              <Input
                placeholder="ex: Fermentation lactique, expression protéique, CRISPR"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Substrat / Milieu</Label>
                <Input
                  placeholder="ex: Glucose, milieu LB, DMEM"
                  value={substrate}
                  onChange={(e) => setSubstrate(e.target.value)}
                />
              </div>
              <div>
                <Label>Niveau BSL estimé</Label>
                <select
                  value={biosafety}
                  onChange={(e) => setBiosafety(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                >
                  <option value="">À déterminer</option>
                  <option value="BSL-1">BSL-1</option>
                  <option value="BSL-2">BSL-2</option>
                  <option value="BSL-3">BSL-3</option>
                </select>
              </div>
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

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 space-y-4"
            >
              {/* Needs more conditions alert */}
              {needsConditions && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Conditions requises pour une prédiction précise</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Cette réaction peut donner différents produits selon les conditions.
                        {result.data?.conditions_needed?.length > 0 && (
                          <span className="block mt-1">
                            Précisez: {result.data.conditions_needed.join(', ')}
                          </span>
                        )}
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-blue-600 hover:bg-blue-700"
                        onClick={() => simulateChemistry(true)}
                      >
                        Relancer avec mes conditions
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Simulation indicative basée sur des données publiques. Consultez un expert pour toute manipulation réelle.
                </p>
              </div>

              {result.type === 'chemistry' && result.data && (
                <div className="space-y-4">
                  {/* Reaction Type */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 mb-1">Type de réaction</p>
                    <p className="text-purple-700">{result.data.reaction_type}</p>
                    {result.data.reaction_mechanism && (
                      <p className="text-xs text-purple-600 mt-1">{result.data.reaction_mechanism}</p>
                    )}
                  </div>

                  {/* Reactants Identified */}
                  {result.data.reactants_identified?.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2">Réactifs identifiés</p>
                      <div className="flex flex-wrap gap-2">
                        {result.data.reactants_identified.map((r, i) => (
                          <div key={i} className="px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                            <span className="font-medium text-slate-900">{r.name}</span>
                            {r.cas && <span className="text-xs text-slate-500 ml-2">CAS: {r.cas}</span>}
                            {r.formula && <span className="text-xs text-blue-600 ml-2">{r.formula}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products - Main section */}
                  {result.data.products?.length > 0 && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800 mb-3">🧪 Produits de réaction</p>
                      <div className="space-y-3">
                        {result.data.products.map((product, i) => (
                          <div key={i} className="p-3 bg-white rounded-lg border border-emerald-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-semibold text-slate-900">{product.name}</span>
                                {product.formula && (
                                  <span className="text-sm text-blue-600 ml-2">{product.formula}</span>
                                )}
                                {product.cas && (
                                  <span className="text-xs text-slate-500 ml-2">CAS: {product.cas}</span>
                                )}
                              </div>
                              <Badge className={
                                product.yield_type === 'majoritaire' ? 'bg-emerald-100 text-emerald-700' :
                                product.yield_type === 'minoritaire' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-600'
                              }>
                                {product.yield_type}
                              </Badge>
                            </div>
                            
                            {/* Kinetic vs Thermodynamic */}
                            <div className="flex gap-2 mt-2">
                              {product.is_kinetic_product && (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                  <Snowflake className="w-3 h-3" />
                                  Produit cinétique
                                </div>
                              )}
                              {product.is_thermodynamic_product && (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                  <Flame className="w-3 h-3" />
                                  Produit thermodynamique
                                </div>
                              )}
                            </div>

                            {product.conditions_favoring && (
                              <p className="text-xs text-slate-600 mt-2">
                                <span className="font-medium">Favorisé par:</span> {product.conditions_favoring}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critical Conditions */}
                  {result.data.critical_conditions && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">⚙️ Conditions critiques</p>
                      <div className="space-y-2 text-sm">
                        {result.data.critical_conditions.temperature_effect && (
                          <p className="text-blue-700">
                            <span className="font-medium">Effet température:</span> {result.data.critical_conditions.temperature_effect}
                          </p>
                        )}
                        {result.data.critical_conditions.optimal_temperature && (
                          <p className="text-blue-700">
                            <span className="font-medium">T° optimale:</span> {result.data.critical_conditions.optimal_temperature}
                          </p>
                        )}
                        {result.data.critical_conditions.selectivity_factors?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.data.critical_conditions.selectivity_factors.map((f, i) => (
                              <Badge key={i} variant="outline" className="bg-white text-xs">{f}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Danger Level */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="font-medium">Niveau de danger</span>
                    <Badge className={getDangerColor(result.data.danger_level)}>
                      {result.data.danger_level?.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Risks with justification */}
                  {result.data.risks?.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-3">⚠️ Risques identifiés</p>
                      <div className="space-y-3">
                        {result.data.risks.map((risk, i) => (
                          <div key={i} className="p-3 bg-white rounded-lg border border-red-200">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className={`w-4 h-4 ${
                                  risk.severity === 'critique' ? 'text-red-600' :
                                  risk.severity === 'élevé' ? 'text-orange-600' :
                                  risk.severity === 'modéré' ? 'text-yellow-600' : 'text-slate-500'
                                }`} />
                                <span className="font-medium text-slate-900">{risk.risk_type}</span>
                              </div>
                              <Badge className={
                                risk.severity === 'critique' ? 'bg-red-100 text-red-700' :
                                risk.severity === 'élevé' ? 'bg-orange-100 text-orange-700' :
                                risk.severity === 'modéré' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-600'
                              }>
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{risk.description}</p>
                            {risk.justification && (
                              <div className="p-2 bg-slate-50 rounded text-xs">
                                <span className="font-medium text-slate-600">Justification: </span>
                                <span className="text-slate-600">{risk.justification}</span>
                              </div>
                            )}
                            {risk.reference && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                <BookOpen className="w-3 h-3" />
                                <span>{risk.reference.source}</span>
                                {risk.reference.detail && <span className="text-slate-500">- {risk.reference.detail}</span>}
                                {risk.reference.url && (
                                  <a href={risk.reference.url} target="_blank" rel="noopener noreferrer" className="ml-1 hover:underline">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PPE */}
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

                  {/* References */}
                  {result.data.references?.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Références scientifiques
                      </p>
                      <div className="space-y-2">
                        {result.data.references.map((ref, i) => (
                          <div key={i} className="text-sm">
                            <p className="text-slate-800">{ref.title}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{ref.source}</span>
                              {ref.year && <span>({ref.year})</span>}
                              {ref.doi && <span>DOI: {ref.doi}</span>}
                              {ref.url && (
                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                  Lien <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.type === 'biotech' && result.data && (
                <div className="space-y-4">
                  {/* Organism ID */}
                  {result.data.organism_identification && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 mb-2">🦠 Identification</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-purple-700">
                          <span className="font-medium">{result.data.organism_identification.scientific_name}</span>
                          {result.data.organism_identification.strain && (
                            <span className="text-purple-600"> ({result.data.organism_identification.strain})</span>
                          )}
                        </p>
                        {result.data.organism_identification.classification && (
                          <p className="text-xs text-purple-600">{result.data.organism_identification.classification}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {result.data.organism_identification.is_gmo && (
                            <Badge className="bg-orange-100 text-orange-700">OGM</Badge>
                          )}
                          {result.data.organism_identification.pathogenicity_class && (
                            <Badge variant="outline">{result.data.organism_identification.pathogenicity_class}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BSL Level */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium">Niveau de biosécurité</span>
                      {result.data.biosafety_justification && (
                        <p className="text-xs text-slate-500 mt-1">{result.data.biosafety_justification}</p>
                      )}
                    </div>
                    <Badge className={getBSLColor(result.data.biosafety_level)}>
                      {result.data.biosafety_level}
                    </Badge>
                  </div>

                  {/* Risks */}
                  {result.data.risks && (
                    <div className="p-4 bg-red-50 rounded-lg space-y-2">
                      <p className="text-sm font-medium text-red-800">⚠️ Risques biologiques</p>
                      {Object.entries(result.data.risks).map(([key, value]) => value && (
                        <p key={key} className="text-sm text-red-700">
                          <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Containment */}
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

                  {/* Decontamination */}
                  {result.data.decontamination && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800 mb-2">🧹 Décontamination</p>
                      {result.data.decontamination.methods?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-emerald-600 font-medium">Méthodes:</p>
                          <ul className="text-sm text-emerald-700 list-disc list-inside">
                            {result.data.decontamination.methods.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                      {result.data.decontamination.waste_management && (
                        <p className="text-sm text-emerald-700">
                          <span className="font-medium">Déchets:</span> {result.data.decontamination.waste_management}
                        </p>
                      )}
                    </div>
                  )}

                  {/* References */}
                  {result.data.references?.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Références & Guidelines
                      </p>
                      <div className="space-y-2">
                        {result.data.references.map((ref, i) => (
                          <div key={i} className="text-sm">
                            <p className="text-slate-800">{ref.title}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{ref.source}</span>
                              {ref.year && <span>({ref.year})</span>}
                              {ref.url && (
                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                  Lien <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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