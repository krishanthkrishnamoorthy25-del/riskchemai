import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Hash, FileText, Atom } from 'lucide-react';

export default function SubstanceIdentity({ substance }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
      <div className="flex items-start gap-4">
        {/* Structure moléculaire */}
        {substance.structure_url ? (
          <div className="w-24 h-24 bg-white rounded-lg border border-slate-200 p-2 flex-shrink-0">
            <img 
              src={substance.structure_url} 
              alt={`Structure de ${substance.name}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-300"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>';
              }}
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-white rounded-lg border border-slate-200 p-2 flex-shrink-0 flex items-center justify-center">
            <Atom className="w-10 h-10 text-slate-300" />
          </div>
        )}

        {/* Informations d'identification */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{substance.name}</h3>
              {substance.iupac_name && substance.iupac_name !== substance.name && (
                <p className="text-sm text-slate-500 italic">{substance.iupac_name}</p>
              )}
            </div>
            <Badge variant="outline" className="flex-shrink-0">
              {substance.role}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Numéro CAS */}
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-500">CAS:</span>
              <span className="font-mono font-medium text-slate-900">{substance.cas || 'N/A'}</span>
            </div>

            {/* Formule brute */}
            {substance.molecular_formula && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-slate-500">Formule:</span>
                <span 
                  className="font-mono font-medium text-slate-900"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMolecularFormula(substance.molecular_formula) 
                  }}
                />
              </div>
            )}

            {/* Masse molaire */}
            {substance.molecular_weight && (
              <div className="flex items-center gap-2 text-sm">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span className="text-slate-500">Masse molaire:</span>
                <span className="font-medium text-slate-900">{substance.molecular_weight} g/mol</span>
              </div>
            )}

            {/* Synonymes */}
            {substance.synonyms && substance.synonyms.length > 0 && (
              <div className="sm:col-span-2 text-sm">
                <span className="text-slate-500">Autres noms: </span>
                <span className="text-slate-700">{substance.synonyms.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction pour formater la formule moléculaire avec indices
function formatMolecularFormula(formula) {
  if (!formula) return '';
  return formula.replace(/(\d+)/g, '<sub>$1</sub>');
}