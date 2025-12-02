import React from 'react';
import { AlertTriangle, Shield, FileText } from 'lucide-react';

export default function LegalDisclaimer({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Avertissement :</strong> Analyse automatisée non contractuelle. 
            Ne pas utiliser pour des synthèses sensibles. 
            Validation par un responsable sécurité obligatoire.
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Analyse indicative - Validation expert requise
      </p>
    );
  }

  // Full version
  return (
    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-800 mb-2">Mentions légales obligatoires</h4>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Analyse automatisée non contractuelle :</strong> Les résultats sont générés 
                par intelligence artificielle et ont un caractère purement informatif.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Validation obligatoire :</strong> Toute manipulation doit être validée 
                par un responsable sécurité qualifié avant exécution.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Usage interdit :</strong> Ne pas utiliser pour la conception ou 
                l'exécution de synthèses sensibles, illicites ou dangereuses.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}