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
  XCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GHS_PICTOGRAMS = {
  'GHS01': { name: 'Explosif', color: 'bg-red-100 text-red-700' },
  'GHS02': { name: 'Inflammable', color: 'bg-orange-100 text-orange-700' },
  'GHS03': { name: 'Comburant', color: 'bg-yellow-100 text-yellow-700' },
  'GHS04': { name: 'Gaz sous pression', color: 'bg-cyan-100 text-cyan-700' },
  'GHS05': { name: 'Corrosif', color: 'bg-purple-100 text-purple-700' },
  'GHS06': { name: 'Toxicité aiguë', color: 'bg-red-100 text-red-700' },
  'GHS07': { name: 'Nocif/Irritant', color: 'bg-amber-100 text-amber-700' },
  'GHS08': { name: 'Danger pour santé', color: 'bg-pink-100 text-pink-700' },
  'GHS09': { name: 'Danger environnement', color: 'bg-emerald-100 text-emerald-700' }
};

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

function SubstanceCard({ substance, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{substance.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              {substance.cas && (
                <span className="text-sm text-slate-500">CAS: {substance.cas}</span>
              )}
              <Badge variant="outline" className="text-xs">
                {substance.role}
              </Badge>
            </div>
          </div>
          <ConfidenceScore score={substance.confidence_score || 0.85} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Danger Summary */}
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{substance.danger_summary}</p>
        </div>

        {/* GHS Classes */}
        {substance.ghs_classes?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Classification GHS</h4>
            <div className="flex flex-wrap gap-2">
              {substance.ghs_classes.map((ghs) => (
                <TooltipProvider key={ghs}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className={GHS_PICTOGRAMS[ghs]?.color || 'bg-slate-100 text-slate-700'}>
                        {ghs}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {GHS_PICTOGRAMS[ghs]?.name || ghs}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

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

export default function RampeTable({ results, onExport }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tableau RAMPE</h2>
          <p className="text-sm text-slate-500">
            {results.length} substance{results.length > 1 ? 's' : ''} analysée{results.length > 1 ? 's' : ''}
          </p>
        </div>
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

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Avertissement :</strong> Cet outil fournit une aide d'identification de risques basée sur des données publiques. 
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