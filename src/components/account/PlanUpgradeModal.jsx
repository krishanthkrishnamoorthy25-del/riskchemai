import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  GraduationCap, 
  Building2, 
  Factory, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const UNIVERSITY_DOMAINS = [
  'edu', 'ac.uk', 'edu.au', 'edu.fr', 'univ-', 'university', 'universite',
  'u-', 'etu.', 'student.', 'eleve.', 'etudiant.', 'ecole-', 'ensc', 'ens.',
  'insa', 'polytechnique', 'centralelille', 'mines-', 'ensam', 'supelec',
  'telecom', 'eisti', 'epita', 'epitech', 'escp', 'essec', 'hec', 'edhec',
  'sciencespo', 'sorbonne', 'psl.', 'dauphine', 'pantheon', 'paris-saclay',
  'univ-lyon', 'univ-paris', 'univ-bordeaux', 'univ-toulouse', 'univ-lille',
  'univ-nantes', 'univ-rennes', 'univ-strasbourg', 'univ-grenoble', 'univ-aix',
  'cnrs', 'inserm', 'inrae', 'cea', 'ifremer', 'ird', 'cirad', 'pasteur',
  'curie', 'college-de-france', 'ehess', 'ephe', 'mnhn'
];

const PME_KEYWORDS_EXCLUDE = [
  'total', 'sanofi', 'loreal', 'lvmh', 'bnp', 'axa', 'carrefour', 'orange',
  'engie', 'danone', 'michelin', 'airbus', 'safran', 'thales', 'dassault',
  'renault', 'peugeot', 'stellantis', 'edf', 'veolia', 'vinci', 'bouygues',
  'capgemini', 'atos', 'schneider', 'saint-gobain', 'legrand', 'air liquide',
  'arkema', 'rhodia', 'basf', 'bayer', 'merck', 'pfizer', 'novartis', 'roche',
  'johnson', 'procter', 'unilever', 'nestle', 'coca-cola', 'pepsico'
];

const LABO_KEYWORDS = [
  'laboratoire', 'laboratory', 'lab', 'research', 'recherche', 'cnrs', 'inserm',
  'inrae', 'cea', 'ifremer', 'ird', 'cirad', 'pasteur', 'curie', 'institut',
  'university', 'université', 'univ', 'college', 'école', 'ecole', 'faculty',
  'faculté', 'department', 'département', 'center', 'centre', 'umr', 'ums',
  'ifr', 'sfr', 'fre', 'erl', 'gdr', 'umi', 'lia', 'lmi', 'gdri'
];

export default function PlanUpgradeModal({ open, onOpenChange, currentPlan, userEmail, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('select'); // select, verify, confirm
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState({
    studentEmail: '',
    verificationCode: '',
    sentCode: null,
    companyName: '',
    siret: '',
    laboName: '',
    laboType: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);

  const plans = [
    {
      id: 'student',
      name: 'Étudiant',
      price: '9,90€/mois',
      icon: GraduationCap,
      color: 'blue',
      description: 'Pour étudiants et écoles',
      verification: 'email_university'
    },
    {
      id: 'standard',
      name: 'PME / Artisans',
      price: '49€/mois',
      icon: Building2,
      color: 'purple',
      description: 'Pour PME et laboratoires',
      verification: 'company_check'
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: '199€/mois',
      icon: Factory,
      color: 'amber',
      description: 'Grandes entreprises',
      verification: 'none'
    }
  ];

  const isUniversityEmail = (email) => {
    const domain = email.toLowerCase().split('@')[1] || '';
    return UNIVERSITY_DOMAINS.some(ud => domain.includes(ud));
  };

  const isPME = (companyName) => {
    const name = companyName.toLowerCase();
    return !PME_KEYWORDS_EXCLUDE.some(kw => name.includes(kw.toLowerCase()));
  };

  const isLaboratory = (name, type) => {
    const fullText = `${name} ${type}`.toLowerCase();
    return LABO_KEYWORDS.some(kw => fullText.includes(kw.toLowerCase()));
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    const email = verificationData.studentEmail;
    
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    if (!isUniversityEmail(email)) {
      setVerificationResult({
        success: false,
        message: 'Cette adresse email ne semble pas être une adresse universitaire ou d\'école supérieure.'
      });
      return;
    }

    setIsVerifying(true);
    const code = generateVerificationCode();

    try {
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: 'ChemRisk AI - Code de vérification étudiant',
        body: `
Bonjour,

Votre code de vérification pour l'abonnement Étudiant ChemRisk AI est : ${code}

Ce code est valide pendant 15 minutes.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

L'équipe ChemRisk AI
        `
      });

      setVerificationData(prev => ({ ...prev, sentCode: code }));
      toast.success('Code de vérification envoyé à ' + email);
      setVerificationResult({
        success: true,
        message: 'Un code de vérification a été envoyé à votre adresse email universitaire.'
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyStudentCode = () => {
    if (verificationData.verificationCode === verificationData.sentCode) {
      setVerificationResult({
        success: true,
        verified: true,
        message: 'Email universitaire vérifié avec succès !'
      });
      return true;
    } else {
      setVerificationResult({
        success: false,
        message: 'Code incorrect. Veuillez réessayer.'
      });
      return false;
    }
  };

  const verifyCompany = async () => {
    const { companyName, siret } = verificationData;

    if (!companyName.trim()) {
      toast.error('Veuillez entrer le nom de votre entreprise');
      return;
    }

    setIsVerifying(true);

    try {
      // Check if it's a known large company
      if (!isPME(companyName)) {
        setVerificationResult({
          success: false,
          message: 'Cette entreprise semble être une grande entreprise. Veuillez choisir le plan Entreprise à 199€/mois pour bénéficier de fonctionnalités adaptées à votre taille.'
        });
        setIsVerifying(false);
        return;
      }

      // Use LLM to verify company size
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Vérifie si "${companyName}" est une PME (moins de 250 salariés) ou une grande entreprise.
        
SIRET fourni: ${siret || 'Non fourni'}

Réponds avec:
- is_pme: true/false
- confidence: 0-100
- reason: explication courte
- employee_estimate: estimation du nombre d'employés si connu`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            is_pme: { type: "boolean" },
            confidence: { type: "number" },
            reason: { type: "string" },
            employee_estimate: { type: "string" }
          }
        }
      });

      if (response.is_pme) {
        setVerificationResult({
          success: true,
          verified: true,
          message: `Entreprise vérifiée : ${companyName} est bien une PME. ${response.reason}`
        });
      } else {
        setVerificationResult({
          success: false,
          message: `${companyName} semble être une grande entreprise (${response.employee_estimate || '>250 employés'}). Veuillez choisir le plan Entreprise.`
        });
      }
    } catch (error) {
      // Fallback: accept if can't verify
      setVerificationResult({
        success: true,
        verified: true,
        message: 'Entreprise enregistrée. Un conseiller vérifiera votre éligibilité.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyLaboratory = async () => {
    const { laboName, laboType } = verificationData;

    if (!laboName.trim()) {
      toast.error('Veuillez entrer le nom de votre laboratoire');
      return;
    }

    setIsVerifying(true);

    try {
      if (!isLaboratory(laboName, laboType)) {
        // Use LLM to verify
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `Vérifie si "${laboName}" (type: ${laboType || 'non spécifié'}) est un laboratoire de recherche, une université ou un établissement d'enseignement supérieur.

Réponds avec:
- is_laboratory: true/false
- type: 'university' | 'research_lab' | 'hospital_lab' | 'private_lab' | 'other'
- confidence: 0-100
- reason: explication courte`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              is_laboratory: { type: "boolean" },
              type: { type: "string" },
              confidence: { type: "number" },
              reason: { type: "string" }
            }
          }
        });

        if (response.is_laboratory && ['university', 'research_lab', 'hospital_lab'].includes(response.type)) {
          setVerificationResult({
            success: true,
            verified: true,
            message: `Laboratoire vérifié : ${laboName} (${response.type})`
          });
        } else {
          setVerificationResult({
            success: false,
            message: `${laboName} ne semble pas être un laboratoire de recherche ou universitaire. ${response.reason}`
          });
        }
      } else {
        setVerificationResult({
          success: true,
          verified: true,
          message: `Laboratoire vérifié : ${laboName}`
        });
      }
    } catch (error) {
      setVerificationResult({
        success: true,
        verified: true,
        message: 'Laboratoire enregistré. Un conseiller vérifiera votre éligibilité.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setVerificationResult(null);
    setVerificationData({
      studentEmail: '',
      verificationCode: '',
      sentCode: null,
      companyName: '',
      siret: '',
      laboName: '',
      laboType: ''
    });

    if (plan.id === 'enterprise') {
      setStep('confirm');
    } else {
      setStep('verify');
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    // Check verification
    if (selectedPlan.id === 'student' && !verificationResult?.verified) {
      toast.error('Veuillez d\'abord vérifier votre email universitaire');
      return;
    }
    if (selectedPlan.id === 'standard' && !verificationResult?.verified) {
      toast.error('Veuillez d\'abord vérifier votre entreprise/laboratoire');
      return;
    }

    setIsVerifying(true);
    try {
      await onUpgrade(selectedPlan.id, {
        studentEmail: verificationData.studentEmail,
        companyName: verificationData.companyName,
        siret: verificationData.siret,
        laboName: verificationData.laboName
      });
      toast.success(`Abonnement ${selectedPlan.name} activé avec succès !`);
      onOpenChange(false);
      setStep('select');
      setSelectedPlan(null);
    } catch (error) {
      toast.error('Erreur lors de la mise à niveau');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedPlan(null);
    setVerificationResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetModal(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            {step === 'select' && 'Choisir un plan'}
            {step === 'verify' && `Vérification - ${selectedPlan?.name}`}
            {step === 'confirm' && 'Confirmer votre abonnement'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Sélectionnez le plan adapté à votre profil'}
            {step === 'verify' && 'Nous devons vérifier votre éligibilité'}
            {step === 'confirm' && 'Dernière étape avant l\'activation'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Plan */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid gap-4 py-4"
            >
              {plans.filter(p => p.id !== currentPlan).map((plan) => {
                const Icon = plan.icon;
                return (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      plan.color === 'blue' ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' :
                      plan.color === 'purple' ? 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' :
                      'border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        plan.color === 'blue' ? 'bg-blue-100' :
                        plan.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          plan.color === 'blue' ? 'text-blue-600' :
                          plan.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{plan.name}</span>
                          <Badge className={
                            plan.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            plan.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }>{plan.price}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{plan.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Step 2: Verification */}
          {step === 'verify' && selectedPlan && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-4 space-y-6"
            >
              {/* Student Verification */}
              {selectedPlan.id === 'student' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                      <strong>Vérification étudiante</strong><br />
                      Entrez votre adresse email universitaire pour recevoir un code de vérification.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Email universitaire</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="prenom.nom@universite.edu"
                        value={verificationData.studentEmail}
                        onChange={(e) => setVerificationData(prev => ({ ...prev, studentEmail: e.target.value }))}
                      />
                      <Button 
                        onClick={sendVerificationEmail}
                        disabled={isVerifying || !verificationData.studentEmail}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Domaines acceptés : .edu, .ac.uk, universités françaises, grandes écoles, instituts de recherche
                    </p>
                  </div>

                  {verificationData.sentCode && (
                    <div className="space-y-2">
                      <Label>Code de vérification</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="123456"
                          value={verificationData.verificationCode}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verificationCode: e.target.value }))}
                          maxLength={6}
                        />
                        <Button 
                          onClick={verifyStudentCode}
                          disabled={verificationData.verificationCode.length !== 6}
                        >
                          Vérifier
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PME/Labo Verification */}
              {selectedPlan.id === 'standard' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-800">
                      <strong>Vérification PME / Laboratoire</strong><br />
                      Ce plan est réservé aux PME (&lt;250 employés) et laboratoires de recherche.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Type d'organisation</Label>
                      <select
                        value={verificationData.laboType}
                        onChange={(e) => setVerificationData(prev => ({ ...prev, laboType: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-slate-200"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="pme">PME / Artisan</option>
                        <option value="labo_public">Laboratoire public (CNRS, INSERM, etc.)</option>
                        <option value="labo_univ">Laboratoire universitaire</option>
                        <option value="labo_prive">Laboratoire privé de recherche</option>
                      </select>
                    </div>

                    {verificationData.laboType === 'pme' && (
                      <>
                        <div className="space-y-2">
                          <Label>Nom de l'entreprise</Label>
                          <Input
                            placeholder="Ma Société SARL"
                            value={verificationData.companyName}
                            onChange={(e) => setVerificationData(prev => ({ ...prev, companyName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SIRET (optionnel)</Label>
                          <Input
                            placeholder="123 456 789 00012"
                            value={verificationData.siret}
                            onChange={(e) => setVerificationData(prev => ({ ...prev, siret: e.target.value }))}
                          />
                        </div>
                        <Button 
                          onClick={verifyCompany}
                          disabled={isVerifying || !verificationData.companyName}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isVerifying ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Vérification...</>
                          ) : (
                            <><Search className="w-4 h-4 mr-2" /> Vérifier l'entreprise</>
                          )}
                        </Button>
                      </>
                    )}

                    {['labo_public', 'labo_univ', 'labo_prive'].includes(verificationData.laboType) && (
                      <>
                        <div className="space-y-2">
                          <Label>Nom du laboratoire / Institut</Label>
                          <Input
                            placeholder="Laboratoire de Chimie Moléculaire"
                            value={verificationData.laboName}
                            onChange={(e) => setVerificationData(prev => ({ ...prev, laboName: e.target.value }))}
                          />
                        </div>
                        <Button 
                          onClick={verifyLaboratory}
                          disabled={isVerifying || !verificationData.laboName}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isVerifying ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Vérification...</>
                          ) : (
                            <><Search className="w-4 h-4 mr-2" /> Vérifier le laboratoire</>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Result */}
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    verificationResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {verificationResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${verificationResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                    {verificationResult.message}
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('select')}>
                  Retour
                </Button>
                <Button 
                  onClick={() => setStep('confirm')}
                  disabled={!verificationResult?.verified}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Continuer
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedPlan && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-4 space-y-6"
            >
              <div className="p-6 bg-slate-50 rounded-xl text-center">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  selectedPlan.color === 'blue' ? 'bg-blue-100' :
                  selectedPlan.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                }`}>
                  {React.createElement(selectedPlan.icon, {
                    className: `w-8 h-8 ${
                      selectedPlan.color === 'blue' ? 'text-blue-600' :
                      selectedPlan.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                    }`
                  })}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedPlan.name}</h3>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{selectedPlan.price}</p>
                <p className="text-sm text-slate-500 mt-1">Facturation mensuelle</p>
              </div>

              {verificationResult?.verified && (
                <div className="p-4 bg-emerald-50 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm text-emerald-800">Éligibilité vérifiée</p>
                </div>
              )}

              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Information :</strong> Vous serez redirigé vers notre page de paiement sécurisée Stripe. 
                  Votre abonnement sera activé immédiatement après le paiement.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(selectedPlan.id === 'enterprise' ? 'select' : 'verify')}>
                  Retour
                </Button>
                <Button 
                  onClick={handleConfirmUpgrade}
                  disabled={isVerifying}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isVerifying ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Traitement...</>
                  ) : (
                    <>Confirmer et payer</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}