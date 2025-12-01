import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Database,
  ExternalLink
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const authorizedSources = [
  { name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov', description: 'NIH/NCBI - Données chimiques complètes' },
  { name: 'ECHA', url: 'https://echa.europa.eu', description: 'Agence Européenne des Produits Chimiques' },
  { name: 'ORD', url: 'https://open-reaction-database.org', description: 'Open Reaction Database - Réactions vérifiées' },
  { name: 'CompTox', url: 'https://comptox.epa.gov', description: 'EPA - Données toxicologiques' },
  { name: 'Europe PMC', url: 'https://europepmc.org', description: 'Publications scientifiques libres' },
];

function getScoreColor(score) {
  if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50' };
  if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50' };
  if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50' };
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50' };
}

function getScoreLabel(score) {
  if (score >= 80) return 'Haute fiabilité';
  if (score >= 60) return 'Fiabilité modérée';
  if (score >= 40) return 'Données partielles';
  return 'Fiabilité limitée';
}

export default function ProvenanceScore({ score, details, sources }) {
  const colors = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className={`p-4 rounded-xl ${colors.light} border`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${colors.text}`} />
          <span className="font-medium text-slate-900">Score de Provenance</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Ce score évalue la fiabilité des données basé sur les sources autorisées: 
                PubChem, ECHA, ORD, CompTox et Europe PMC.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-slate-200"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className={colors.text}
              initial={{ strokeDasharray: "0 176" }}
              animate={{ strokeDasharray: `${(score / 100) * 176} 176` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
          </div>
        </div>
        <div>
          <Badge className={`${colors.light} ${colors.text} border-none`}>
            {label}
          </Badge>
          {details && (
            <p className="text-sm text-slate-600 mt-1">{details}</p>
          )}
        </div>
      </div>

      {/* Sources Used */}
      {sources && sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-2">Sources utilisées:</p>
          <div className="flex flex-wrap gap-1">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Database className="w-3 h-3" />
                {src.name || src.source}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Authorized Sources Info */}
      <div className="mt-3 pt-3 border-t border-slate-200">
        <details className="text-xs">
          <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
            Sources autorisées (5)
          </summary>
          <div className="mt-2 space-y-1">
            {authorizedSources.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-1.5 bg-white rounded hover:bg-slate-50"
              >
                <span className="font-medium text-slate-700">{src.name}</span>
                <span className="text-slate-500">{src.description}</span>
              </a>
            ))}
          </div>
        </details>
      </div>

      {/* Enterprise Upgrade Notice */}
      <div className="mt-3 p-2 bg-purple-50 rounded-lg text-xs">
        <p className="text-purple-700">
          <span className="font-medium">🔐 Plan Entreprise:</span> Accès à Reaxys, SciFinder et licences éditeurs pour des données premium.
        </p>
      </div>
    </div>
  );
}