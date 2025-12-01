import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  ExternalLink, 
  Download,
  Info,
  CheckCircle,
  Atom,
  Hash,
  FileText
} from 'lucide-react';
import { GHSPictogramRow } from './GHSPictograms';
import QuickSearch from './QuickSearch';

function ConfidenceScore({ score }) {
  const percentage = Math.round(score * 100);
  const color = percentage >= 80 ? 'text-emerald-600' : percentage >= 60 ? 'text-amber-600' : 'text-red-600';
  const bgColor = percentage >= 80 ? 'bg-emerald-100' : percentage >= 60 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bgColor}`}>
      {percentage >= 80 ? (
        <CheckCircle className={`w-3.5 h-3.5 ${color}`} />
      ) : (
        <Info className={`w-3.5 h-3.5 ${color}`} />
      )}
      <span className={`text-xs font-medium ${color}`}>{percentage}%</span>
    </div>
  );
}

// Fonction pour formater la formule moléculaire avec indices
function formatMolecularFormula(formula) {
  if (!formula) return '';
  return formula.replace(/(\d+)/g, '<sub>$1</sub>');
}

function SubstanceCard({ substance, index }) {
  // URL de structure PubChem basée sur le CAS
  const structureUrl = substance.cas 
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(substance.cas)}/PNG?image_size=200x200`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header avec identification complète */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex gap-4">
          {/* Structure moléculaire */}
          <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 flex-shrink-0 overflow-hidden">
            {structureUrl ? (
              <img 
                src={structureUrl}
                alt={`Structure ${substance.name}`}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full items-center justify-center ${structureUrl ? 'hidden' : 'flex'}`}>
              <Atom className="w-8 h-8 text-slate-300" />
            </div>
          </div>

          {/* Infos d'identification */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{substance.name}</h3>
                {substance.iupac_name && substance.iupac_name !== substance.name && (
                  <p className="text-xs text-slate-500 italic truncate">{substance.iupac_name}</p>
                )}
              </div>
              <ConfidenceScore score={substance.confidence_score || 0.85} />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {/* CAS */}
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-500">CAS:</span>
                <span className="font-mono font-semibold text-slate-900">{substance.cas || 'N/A'}</span>
              </div>
              
              {/* Formule brute */}
              {substance.molecular_formula && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-500">Formule:</span>
                  <span 
                    className="font-mono font-semibold text-slate-900"
                    dangerouslySetInnerHTML={{ __html: formatMolecularFormula(substance.molecular_formula) }}
                  />
                </div>
              )}

              {/* Masse molaire */}
              {substance.molecular_weight && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">MM:</span>
                  <span className="font-semibold text-slate-900">{substance.molecular_weight} g/mol</span>
                </div>
              )}
            </div>

            {/* Synonymes */}
            {substance.synonyms && substance.synonyms.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Aussi connu: {substance.synonyms.slice(0, 2).join(', ')}
              </p>
            )}

            <Badge variant="outline" className="mt-2 text-xs">
              {substance.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Pictogrammes GHS */}
        {substance.ghs_classes?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Pictogrammes GHS</h4>
            <GHSPictogramRow codes={substance.ghs_classes} size={48} />
          </div>
        )}

        {/* Danger Summary */}
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{substance.danger_summary}</p>
        </div>

        {/* H Codes */}
        {substance.h_codes?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Mentions de danger (H)</h4>
            <div className="flex flex-wrap gap-2">
              {substance.h_codes.map((code) => (
                <Badge key={code} variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* P Codes */}
        {substance.p_codes?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Conseils de prudence (P)</h4>
            <div className="flex flex-wrap gap-2">
              {substance.p_codes.map((code) => (
                <Badge key={code} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Protections */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Protections recommandées
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {substance.protections?.epi && (
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs font-medium text-emerald-800 mb-1">EPI</p>
                <p className="text-sm text-emerald-700">{substance.protections.epi}</p>
              </div>
            )}
            {substance.protections?.ventilation && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-1">Ventilation</p>
                <p className="text-sm text-blue-700">{substance.protections.ventilation}</p>
              </div>
            )}
            {substance.protections?.stockage && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-800 mb-1">Stockage</p>
                <p className="text-sm text-purple-700">{substance.protections.stockage}</p>
              </div>
            )}
            {substance.protections?.incompatibilites && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs font-medium text-red-800 mb-1">Incompatibilités</p>
                <p className="text-sm text-red-700">{substance.protections.incompatibilites}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {substance.sources?.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 mb-2">Sources</h4>
            <div className="flex flex-wrap gap-2">
              {substance.sources.map((source, i) => (
                <a 
                  key={i}
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  {source.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RampeTable({ results, onExport, onQuickSearch, isSearching }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tableau RAMPE</h2>
          <p className="text-sm text-slate-500">
            {results.length} substance{results.length > 1 ? 's' : ''} analysée{results.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quick Search */}
          {onQuickSearch && (
            <div className="w-full sm:w-64">
              <QuickSearch onSearch={onQuickSearch} isLoading={isSearching} />
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onExport('csv')} className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => onExport('pdf')} className="gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Avertissement :</strong> Cet outil fournit une aide d'identification de risques basée sur des données publiques (PubChem, ECHA). 
            Toutes les informations doivent être vérifiées par un responsable HSE qualifié. 
            Aucun protocole expérimental n'est fourni.
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {results.map((substance, index) => (
          <SubstanceCard key={index} substance={substance} index={index} />
        ))}
      </div>
    </div>
  );
}