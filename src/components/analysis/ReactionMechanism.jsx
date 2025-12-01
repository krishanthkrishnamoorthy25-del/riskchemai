import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  BookOpen, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut,
  Download,
  Info
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Composant pour afficher une structure moléculaire simple (texte stylisé)
function MoleculeStructure({ formula, name, role }) {
  const roleColors = {
    reactant: 'border-blue-300 bg-blue-50',
    intermediate: 'border-amber-300 bg-amber-50',
    product: 'border-emerald-300 bg-emerald-50',
    catalyst: 'border-purple-300 bg-purple-50',
    leaving_group: 'border-red-300 bg-red-50'
  };

  const roleLabels = {
    reactant: 'Réactif',
    intermediate: 'Intermédiaire',
    product: 'Produit',
    catalyst: 'Catalyseur',
    leaving_group: 'Groupe partant'
  };

  // Formater la formule avec indices
  const formatFormula = (f) => {
    if (!f) return '';
    return f.replace(/(\d+)/g, '₀₁₂₃₄₅₆₇₈₉'.split('').reduce((acc, digit, i) => 
      acc.replace(new RegExp(i.toString(), 'g'), digit), f));
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${roleColors[role] || 'border-slate-200 bg-slate-50'} text-center min-w-[100px]`}>
      <p className="font-mono text-lg font-bold text-slate-800">
        {formatFormula(formula)}
      </p>
      {name && <p className="text-xs text-slate-600 mt-1">{name}</p>}
      <Badge variant="outline" className="mt-2 text-xs">
        {roleLabels[role] || role}
      </Badge>
    </div>
  );
}

// Composant flèche de mécanisme
function MechanismArrow({ type, label, electrons }) {
  const arrowTypes = {
    full: '→',           // Flèche pleine (mouvement de paire d'électrons)
    half: '⇀',           // Demi-flèche (mouvement d'un électron - radical)
    equilibrium: '⇌',    // Équilibre
    resonance: '↔',      // Résonance
    curved: '↷'          // Flèche courbe
  };

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <span className="text-3xl text-slate-700">{arrowTypes[type] || '→'}</span>
      {label && <span className="text-xs text-slate-500 mt-1">{label}</span>}
      {electrons && (
        <span className="text-xs text-blue-600 font-medium">{electrons}e⁻</span>
      )}
    </div>
  );
}

// Étape du mécanisme
function MechanismStep({ step, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        <h4 className="font-medium text-slate-900">{step.name}</h4>
        {step.rate_determining && (
          <Badge className="bg-red-100 text-red-700 text-xs">Étape limitante</Badge>
        )}
      </div>

      {/* Description de l'étape */}
      <p className="text-sm text-slate-600 mb-4">{step.description}</p>

      {/* Visualisation des structures */}
      <div className="flex items-center justify-center gap-2 flex-wrap py-4 px-2 bg-slate-50 rounded-lg overflow-x-auto">
        {step.structures?.map((struct, i) => (
          <React.Fragment key={i}>
            {i > 0 && struct.role !== 'product' && (
              <span className="text-2xl text-slate-400">+</span>
            )}
            {struct.role === 'product' && i > 0 && (
              <MechanismArrow 
                type={step.arrow_type || 'full'} 
                label={step.arrow_label}
                electrons={step.electrons_moved}
              />
            )}
            <MoleculeStructure 
              formula={struct.formula} 
              name={struct.name}
              role={struct.role}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Détails électroniques */}
      {step.electronic_details && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <span className="font-medium">Mouvement électronique: </span>
          {step.electronic_details}
        </div>
      )}

      {/* Référence */}
      {step.reference && (
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <BookOpen className="w-3 h-3" />
          <span>{step.reference}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function ReactionMechanism({ mechanism }) {
  if (!mechanism) return null;

  return (
    <div className="space-y-4">
      {/* Avertissement important */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Proposition de mécanisme</AlertTitle>
        <AlertDescription className="text-amber-700 text-sm">
          Ce mécanisme est une <strong>proposition basée sur la littérature scientifique</strong> et les principes 
          de chimie organique. Il doit être <strong>vérifié par un chimiste qualifié</strong> avant toute utilisation. 
          Les conditions réelles peuvent conduire à des chemins réactionnels différents.
        </AlertDescription>
      </Alert>

      {/* Source du mécanisme */}
      {mechanism.literature_source && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Mécanisme basé sur:</p>
              <p className="text-sm text-emerald-700">{mechanism.literature_source}</p>
              {mechanism.doi && (
                <a 
                  href={`https://doi.org/${mechanism.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  DOI: {mechanism.doi} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Type de mécanisme */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-purple-100 text-purple-800">{mechanism.type}</Badge>
        {mechanism.stereochemistry && (
          <Badge className="bg-blue-100 text-blue-800">{mechanism.stereochemistry}</Badge>
        )}
        {mechanism.concerted && (
          <Badge className="bg-slate-100 text-slate-800">Concerté</Badge>
        )}
        {!mechanism.concerted && mechanism.steps?.length > 1 && (
          <Badge className="bg-slate-100 text-slate-800">Multi-étapes</Badge>
        )}
      </div>

      {/* Étapes du mécanisme */}
      <div className="space-y-4">
        {mechanism.steps?.map((step, index) => (
          <MechanismStep 
            key={index} 
            step={step} 
            index={index}
            total={mechanism.steps.length}
          />
        ))}
      </div>

      {/* Schéma global simplifié */}
      {mechanism.overall_scheme && (
        <div className="p-4 bg-slate-900 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">Schéma global</p>
          <p className="font-mono text-lg text-white text-center">
            {mechanism.overall_scheme}
          </p>
        </div>
      )}

      {/* Notes supplémentaires */}
      {mechanism.notes && (
        <div className="p-3 bg-slate-50 rounded-lg flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 mt-0.5" />
          <p className="text-sm text-slate-600">{mechanism.notes}</p>
        </div>
      )}

      {/* Disclaimer final */}
      <p className="text-xs text-slate-400 text-center italic">
        Les structures sont des représentations simplifiées. Consultez les publications citées pour les détails complets.
      </p>
    </div>
  );
}