import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, FlaskConical, Zap, FileText, Shield } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: "Bienvenue sur ChemRisk Pro ! 👋",
    description: "Découvrez comment analyser vos risques chimiques en quelques clics. Ce tour rapide vous montre les fonctionnalités essentielles.",
    icon: FlaskConical,
    position: 'center'
  },
  {
    id: 'analysis',
    title: "Créez une analyse RAMPE",
    description: "Cliquez sur 'Nouvelle analyse' pour entrer vos substances chimiques. L'IA identifie automatiquement les risques via PubChem et ECHA.",
    icon: FlaskConical,
    target: '[data-tour="new-analysis"]',
    position: 'bottom'
  },
  {
    id: 'simulator',
    title: "Simulez des réactions",
    description: "Le simulateur prédit les produits et risques d'une réaction chimique. Idéal pour anticiper les dangers avant manipulation.",
    icon: Zap,
    target: '[data-tour="simulator"]',
    position: 'top'
  },
  {
    id: 'export',
    title: "Exportez vos résultats",
    description: "Téléchargez vos tableaux RAMPE en PDF ou CSV pour vos rapports et documentation réglementaire.",
    icon: FileText,
    target: '[data-tour="export"]',
    position: 'left'
  },
  {
    id: 'privacy',
    title: "Vos données sont protégées",
    description: "Conformément au RGPD, nous ne conservons jamais le contenu de vos analyses. Seules les métadonnées anonymisées sont stockées.",
    icon: Shield,
    position: 'center'
  }
];

export default function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_completed', 'true');
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="p-6">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <Icon className="w-8 h-8 text-emerald-600" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {step.title}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep 
                      ? 'w-6 bg-emerald-500' 
                      : index < currentStep 
                        ? 'w-1.5 bg-emerald-300' 
                        : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>

              <Button
                onClick={handleNext}
                className="bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Skip */}
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full mt-4 text-sm text-slate-400 hover:text-slate-600"
              >
                Passer le tour
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}