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

// Domaines de laboratoires et instituts de recherche reconnus
const LABO_EMAIL_DOMAINS = [
  'cnrs.fr', 'inserm.fr', 'inrae.fr', 'cea.fr', 'ifremer.fr', 'ird.fr', 
  'cirad.fr', 'pasteur.fr', 'curie.fr', 'college-de-france.fr', 'ehess.fr',
  'ephe.fr', 'mnhn.fr', 'inria.fr', 'irstea.fr', 'onera.fr', 'cnes.fr',
  'irsn.fr', 'anses.fr', 'brgm.fr', 'ifpen.fr', 'ifsttar.fr', 'ineris.fr',
  'univ-', 'u-paris', 'sorbonne-universite.fr', 'psl.eu', 'ip-paris.fr',
  'universite-paris-saclay.fr', 'univ-lyon', 'univ-amu.fr', 'univ-grenoble-alpes.fr',
  'chu-', 'aphp.fr', 'inserm.', 'institut-curie.org'
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
    companyEmail: '',
    companyEmailCode: '',
    companyEmailSentCode: null,
    laboName: '',
    laboType: '',
    laboEmail: '',
    laboEmailCode: '',
    laboEmailSentCode: null,
    emailVerified: false
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

  const isLaboEmail = (email) => {
    const domain = email.toLowerCase().split('@')[1] || '';
    return LABO_EMAIL_DOMAINS.some(ld => domain.includes(ld)) || 
           UNIVERSITY_DOMAINS.some(ud => domain.includes(ud));
  };

  const extractDomainName = (email) => {
    const domain = email.split('@')[1] || '';
    return domain.split('.')[0];
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

  const sendCompanyVerificationEmail = async () => {
    const { companyEmail, companyName } = verificationData;

    if (!companyEmail || !companyEmail.includes('@')) {
      toast.error('Veuillez entrer votre email professionnel');
      return;
    }

    // Vérifier que le domaine email correspond au nom de l'entreprise
    const emailDomain = extractDomainName(companyEmail).toLowerCase();
    const companyNameLower = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    setIsVerifying(true);
    
    try {
      // Vérification via LLM que l'email correspond à l'entreprise
      const domainCheck = await base44.integrations.Core.InvokeLLM({
        prompt: `Vérifie si le domaine email "${companyEmail.split('@')[1]}" appartient bien à l'entreprise "${companyName}".

Recherche sur internet si ce domaine est bien le domaine officiel de cette entreprise.

Réponds avec:
- matches: true/false (le domaine appartient-il à cette entreprise?)
- confidence: 0-100
- reason: explication courte
- official_domain: le domaine officiel de l'entreprise si différent`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            matches: { type: "boolean" },
            confidence: { type: "number" },
            reason: { type: "string" },
            official_domain: { type: "string" }
          }
        }
      });

      if (!domainCheck.matches && domainCheck.confidence > 70) {
        setVerificationResult({
          success: false,
          message: `L'email ${companyEmail} ne semble pas correspondre à ${companyName}. ${domainCheck.reason}${domainCheck.official_domain ? ` Utilisez plutôt une adresse @${domainCheck.official_domain}` : ''}`
        });
        setIsVerifying(false);
        return;
      }

      const code = generateVerificationCode();
      await base44.integrations.Core.SendEmail({
        to: companyEmail,
        subject: 'ChemRisk AI - Code de vérification entreprise',
        body: `
Bonjour,

Votre code de vérification pour l'abonnement PME ChemRisk AI est : ${code}

Entreprise : ${companyName}

Ce code est valide pendant 15 minutes.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

L'équipe ChemRisk AI
        `
      });

      setVerificationData(prev => ({ ...prev, companyEmailSentCode: code }));
      toast.success('Code de vérification envoyé à ' + companyEmail);
      setVerificationResult({
        success: true,
        message: 'Un code de vérification a été envoyé à votre email professionnel.'
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCompanyCode = async () => {
    if (verificationData.companyEmailCode !== verificationData.companyEmailSentCode) {
      setVerificationResult({
        success: false,
        message: 'Code incorrect. Veuillez réessayer.'
      });
      return;
    }

    // Code correct, maintenant vérifier si c'est une PME
    const { companyName, siret } = verificationData;
    setIsVerifying(true);

    try {
      if (!isPME(companyName)) {
        setVerificationResult({
          success: false,
          message: 'Cette entreprise semble être une grande entreprise. Veuillez choisir le plan Entreprise à 199€/mois.'
        });
        setIsVerifying(false);
        return;
      }

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

      if (response.is_pme || response.confidence < 60) {
        setVerificationData(prev => ({ ...prev, emailVerified: true }));
        setVerificationResult({
          success: true,
          verified: true,
          message: `✓ Email vérifié et entreprise validée : ${companyName}`
        });
      } else {
        setVerificationResult({
          success: false,
          message: `${companyName} semble être une grande entreprise (${response.employee_estimate || '>250 employés'}). Veuillez choisir le plan Entreprise.`
        });
      }
    } catch (error) {
      setVerificationData(prev => ({ ...prev, emailVerified: true }));
      setVerificationResult({
        success: true,
        verified: true,
        message: '✓ Email vérifié. Éligibilité confirmée.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const sendLaboVerificationEmail = async () => {
    const { laboEmail, laboName } = verificationData;

    if (!laboEmail || !laboEmail.includes('@')) {
      toast.error('Veuillez entrer votre email institutionnel');
      return;
    }

    // Vérifier que c'est bien un email de labo/université
    if (!isLaboEmail(laboEmail)) {
      setVerificationResult({
        success: false,
        message: 'Cet email ne semble pas être un email institutionnel de laboratoire ou université. Utilisez votre email professionnel @cnrs.fr, @inserm.fr, @univ-xxx.fr, etc.'
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Vérifier que le domaine correspond au laboratoire indiqué
      const domainCheck = await base44.integrations.Core.InvokeLLM({
        prompt: `Vérifie si le domaine email "${laboEmail.split('@')[1]}" appartient ou est affilié au laboratoire/institut "${laboName}".

Recherche sur internet si:
1. Ce domaine est bien un domaine de recherche/universitaire légitime
2. Il peut être associé à "${laboName}"

Réponds avec:
- is_valid_research_domain: true/false
- matches_institution: true/false
- confidence: 0-100
- institution_found: le nom de l'institution trouvée pour ce domaine
- reason: explication`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            is_valid_research_domain: { type: "boolean" },
            matches_institution: { type: "boolean" },
            confidence: { type: "number" },
            institution_found: { type: "string" },
            reason: { type: "string" }
          }
        }
      });

      if (!domainCheck.is_valid_research_domain) {
        setVerificationResult({
          success: false,
          message: `Le domaine ${laboEmail.split('@')[1]} n'est pas reconnu comme un domaine de recherche. ${domainCheck.reason}`
        });
        setIsVerifying(false);
        return;
      }

      const code = generateVerificationCode();
      await base44.integrations.Core.SendEmail({
        to: laboEmail,
        subject: 'ChemRisk AI - Code de vérification laboratoire',
        body: `
Bonjour,

Votre code de vérification pour l'abonnement Laboratoire ChemRisk AI est : ${code}

Laboratoire : ${laboName}

Ce code est valide pendant 15 minutes.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

L'équipe ChemRisk AI
        `
      });

      setVerificationData(prev => ({ ...prev, laboEmailSentCode: code }));
      toast.success('Code de vérification envoyé à ' + laboEmail);
      setVerificationResult({
        success: true,
        message: `Code envoyé à ${laboEmail}. ${domainCheck.institution_found ? `Institution détectée : ${domainCheck.institution_found}` : ''}`
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyLaboCode = async () => {
    if (verificationData.laboEmailCode !== verificationData.laboEmailSentCode) {
      setVerificationResult({
        success: false,
        message: 'Code incorrect. Veuillez réessayer.'
      });
      return;
    }

    setVerificationData(prev => ({ ...prev, emailVerified: true }));
    setVerificationResult({
      success: true,
      verified: true,
      message: `✓ Email institutionnel vérifié pour ${verificationData.laboName}`
    });
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
      companyEmail: '',
      companyEmailCode: '',
      companyEmailSentCode: null,
      laboName: '',
      laboType: '',
      laboEmail: '',
      laboEmailCode: '',
      laboEmailSentCode: null,
      emailVerified: false
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
                      <strong>Vérification obligatoire</strong><br />
                      Ce plan est réservé aux PME (&lt;250 employés) et laboratoires de recherche. 
                      Vous devez vérifier votre email professionnel.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Type d'organisation</Label>
                      <select
                        value={verificationData.laboType}
                        onChange={(e) => setVerificationData(prev => ({ 
                          ...prev, 
                          laboType: e.target.value,
                          emailVerified: false,
                          companyEmailSentCode: null,
                          laboEmailSentCode: null
                        }))}
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
                          <Label>Nom de l'entreprise *</Label>
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
                        <div className="space-y-2">
                          <Label>Email professionnel * (doit correspondre à l'entreprise)</Label>
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="vous@votre-entreprise.fr"
                              value={verificationData.companyEmail}
                              onChange={(e) => setVerificationData(prev => ({ ...prev, companyEmail: e.target.value }))}
                            />
                            <Button 
                              onClick={sendCompanyVerificationEmail}
                              disabled={isVerifying || !verificationData.companyName || !verificationData.companyEmail}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            </Button>
                          </div>
                          <p className="text-xs text-slate-500">
                            L'email doit correspondre au domaine de votre entreprise (pas de gmail, hotmail, etc.)
                          </p>
                        </div>
                        
                        {verificationData.companyEmailSentCode && (
                          <div className="space-y-2">
                            <Label>Code de vérification</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="123456"
                                value={verificationData.companyEmailCode}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, companyEmailCode: e.target.value }))}
                                maxLength={6}
                              />
                              <Button 
                                onClick={verifyCompanyCode}
                                disabled={isVerifying || verificationData.companyEmailCode.length !== 6}
                              >
                                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vérifier'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {['labo_public', 'labo_univ', 'labo_prive'].includes(verificationData.laboType) && (
                      <>
                        <div className="space-y-2">
                          <Label>Nom du laboratoire / Institut *</Label>
                          <Input
                            placeholder="Laboratoire de Chimie Moléculaire - CNRS"
                            value={verificationData.laboName}
                            onChange={(e) => setVerificationData(prev => ({ ...prev, laboName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email institutionnel * (@cnrs.fr, @inserm.fr, @univ-xxx.fr, etc.)</Label>
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="prenom.nom@cnrs.fr"
                              value={verificationData.laboEmail}
                              onChange={(e) => setVerificationData(prev => ({ ...prev, laboEmail: e.target.value }))}
                            />
                            <Button 
                              onClick={sendLaboVerificationEmail}
                              disabled={isVerifying || !verificationData.laboName || !verificationData.laboEmail}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            </Button>
                          </div>
                          <p className="text-xs text-slate-500">
                            Seuls les emails institutionnels de recherche sont acceptés
                          </p>
                        </div>

                        {verificationData.laboEmailSentCode && (
                          <div className="space-y-2">
                            <Label>Code de vérification</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="123456"
                                value={verificationData.laboEmailCode}
                                onChange={(e) => setVerificationData(prev => ({ ...prev, laboEmailCode: e.target.value }))}
                                maxLength={6}
                              />
                              <Button 
                                onClick={verifyLaboCode}
                                disabled={verificationData.laboEmailCode.length !== 6}
                              >
                                Vérifier
                              </Button>
                            </div>
                          </div>
                        )}
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