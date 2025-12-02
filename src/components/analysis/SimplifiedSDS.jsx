import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, Copy, Check, AlertTriangle,
  Thermometer, Droplets, Wind, Shield, Leaf, Flame
} from 'lucide-react';
import { toast } from 'sonner';
import GHSPictograms from './GHSPictograms';

export default function SimplifiedSDS({ substance }) {
  const [copied, setCopied] = useState(false);

  if (!substance) return null;

  const copyToClipboard = () => {
    const text = generateSDSText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('FDS simplifiée copiée');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSDSText = () => {
    return `
FICHE DE DONNÉES DE SÉCURITÉ SIMPLIFIÉE
========================================
⚠️ DOCUMENT NON CONTRACTUEL - USAGE INTERNE UNIQUEMENT

SECTION 1 - IDENTIFICATION
Nom: ${substance.name || 'N/A'}
CAS: ${substance.cas || 'N/A'}
Formule: ${substance.molecular_formula || 'N/A'}
Masse molaire: ${substance.molecular_weight || 'N/A'} g/mol

SECTION 2 - DANGERS
${(substance.ghs_classes || []).join(', ') || 'Non classifié'}

Mentions de danger:
${(substance.h_codes || []).join('\n') || 'Aucune'}

Conseils de prudence:
${(substance.p_codes || []).join('\n') || 'Aucun'}

Résumé dangers: ${substance.danger_summary || 'N/A'}

SECTION 3 - EPI REQUIS
${substance.protections?.epi || 'Consulter FDS officielle'}

SECTION 4 - STOCKAGE
${substance.protections?.stockage || 'Consulter FDS officielle'}

SECTION 5 - INCOMPATIBILITÉS
${substance.protections?.incompatibilites || 'Consulter FDS officielle'}

---
Généré par ChemRisk AI le ${new Date().toLocaleDateString('fr-FR')}
Ce document ne remplace pas la FDS officielle du fournisseur.
    `.trim();
  };

  const downloadPDF = () => {
    // Génération d'un PDF simplifié via impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>FDS Simplifiée - ${substance.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1e293b; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
            h2 { color: #334155; margin-top: 20px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 8px; margin: 20px 0; }
            .danger { color: #dc2626; }
            .section { margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
            .badge { display: inline-block; padding: 4px 8px; background: #e2e8f0; border-radius: 4px; margin: 2px; font-size: 12px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>📋 Fiche de Données de Sécurité Simplifiée</h1>
          
          <div class="warning">
            <strong>⚠️ AVERTISSEMENT :</strong> Ce document est un résumé non contractuel généré automatiquement. 
            Il ne remplace pas la FDS officielle du fournisseur. Validation par un responsable HSE obligatoire.
          </div>
          
          <h2>1. Identification</h2>
          <div class="section">
            <p><strong>Nom :</strong> ${substance.name || 'N/A'}</p>
            <p><strong>N° CAS :</strong> ${substance.cas || 'N/A'}</p>
            <p><strong>Formule :</strong> ${substance.molecular_formula || 'N/A'}</p>
            <p><strong>Masse molaire :</strong> ${substance.molecular_weight || 'N/A'} g/mol</p>
            ${substance.iupac_name ? `<p><strong>IUPAC :</strong> ${substance.iupac_name}</p>` : ''}
          </div>
          
          <h2>2. Classification des dangers</h2>
          <div class="section">
            <p><strong>Classes GHS :</strong></p>
            ${(substance.ghs_classes || []).map(c => `<span class="badge">${c}</span>`).join(' ') || '<span class="badge">Non classifié</span>'}
            
            <p style="margin-top: 15px;"><strong>Mentions de danger (H) :</strong></p>
            <ul>
              ${(substance.h_codes || []).map(h => `<li class="danger">${h}</li>`).join('') || '<li>Aucune</li>'}
            </ul>
            
            <p><strong>Conseils de prudence (P) :</strong></p>
            <ul>
              ${(substance.p_codes || []).map(p => `<li>${p}</li>`).join('') || '<li>Aucun</li>'}
            </ul>
          </div>
          
          <h2>3. Résumé des dangers</h2>
          <div class="section">
            <p>${substance.danger_summary || 'Consulter la FDS officielle'}</p>
          </div>
          
          <h2>4. Équipements de Protection Individuelle</h2>
          <div class="section">
            <p>${substance.protections?.epi || 'Consulter la FDS officielle'}</p>
          </div>
          
          <h2>5. Conditions de stockage</h2>
          <div class="section">
            <p>${substance.protections?.stockage || 'Consulter la FDS officielle'}</p>
          </div>
          
          <h2>6. Incompatibilités</h2>
          <div class="section">
            <p>${substance.protections?.incompatibilites || 'Consulter la FDS officielle'}</p>
          </div>
          
          <h2>7. Ventilation</h2>
          <div class="section">
            <p>${substance.protections?.ventilation || 'Consulter la FDS officielle'}</p>
          </div>
          
          <div class="footer">
            <p>📄 Document généré par ChemRisk AI le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Ce document est fourni à titre informatif uniquement et ne constitue pas une FDS réglementaire au sens du règlement REACH.</p>
            <p>Toujours se référer à la FDS officielle du fournisseur pour les informations complètes et à jour.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-blue-800">
            <FileText className="w-5 h-5" />
            FDS Simplifiée
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-1">
              <Download className="w-3 h-3" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Avertissement */}
        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Non contractuel</strong> - Ne remplace pas la FDS officielle
          </p>
        </div>

        {/* Identification */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-500">Nom</p>
            <p className="font-medium">{substance.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">CAS</p>
            <p className="font-mono">{substance.cas || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Formule</p>
            <p className="font-mono">{substance.molecular_formula || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Masse molaire</p>
            <p>{substance.molecular_weight ? `${substance.molecular_weight} g/mol` : 'N/A'}</p>
          </div>
        </div>

        {/* Pictogrammes GHS */}
        {substance.ghs_classes?.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Pictogrammes GHS</p>
            <GHSPictograms codes={substance.ghs_classes} size="md" />
          </div>
        )}

        {/* Résumé danger */}
        {substance.danger_summary && (
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-500 mb-1">Résumé des dangers</p>
            <p className="text-red-800">{substance.danger_summary}</p>
          </div>
        )}

        {/* Codes H & P */}
        <div className="grid md:grid-cols-2 gap-3">
          {substance.h_codes?.length > 0 && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-500 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Mentions de danger
              </p>
              <div className="flex flex-wrap gap-1">
                {substance.h_codes.slice(0, 5).map((h, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-white">
                    {h.split(':')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {substance.p_codes?.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-500 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Conseils de prudence
              </p>
              <div className="flex flex-wrap gap-1">
                {substance.p_codes.slice(0, 5).map((p, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-white">
                    {p.split(':')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Protections */}
        {substance.protections && (
          <div className="grid gap-2">
            {substance.protections.epi && (
              <div className="flex items-start gap-2 p-2 bg-emerald-50 rounded">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-emerald-600 font-medium">EPI</p>
                  <p className="text-xs text-emerald-800">{substance.protections.epi}</p>
                </div>
              </div>
            )}
            {substance.protections.stockage && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded">
                <Thermometer className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-600 font-medium">Stockage</p>
                  <p className="text-xs text-amber-800">{substance.protections.stockage}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}