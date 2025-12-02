import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlaskConical, Plus, Trash2, Loader2, AlertTriangle, Search, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkSubstancesForAbuse } from './AbuseFilter';

export default function ChemicalAnalysisForm({ onSubmit, isLoading }) {
  const [substances, setSubstances] = useState([{ name: '', cas: '', role: 'reactif' }]);
  const [abuseWarning, setAbuseWarning] = useState(null);

  const addSubstance = () => {
    setSubstances([...substances, { name: '', cas: '', role: 'reactif' }]);
  };

  const removeSubstance = (index) => {
    if (substances.length > 1) {
      setSubstances(substances.filter((_, i) => i !== index));
    }
  };

  const updateSubstance = (index, field, value) => {
    // SÉCURITÉ: Sanitize input - limite la longueur et supprime les caractères dangereux
    const sanitizedValue = String(value)
      .slice(0, 200) // Max 200 caractères
      .replace(/<[^>]*>/g, '') // Supprime les balises HTML
      .replace(/[<>\"\'`;]/g, ''); // Supprime les caractères dangereux
    
    const updated = [...substances];
    updated[index][field] = sanitizedValue;
    setSubstances(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validSubstances = substances.filter(s => s.name.trim() || s.cas.trim());
    if (validSubstances.length === 0) return;

    // Check for abuse
    const abuseCheck = checkSubstancesForAbuse(validSubstances);
    if (abuseCheck.blocked) {
      setAbuseWarning({
        type: 'blocked',
        message: 'Cette recherche n\'est pas autorisée pour des raisons de sécurité.'
      });
      return;
    }
    if (abuseCheck.warning) {
      setAbuseWarning({
        type: 'warning',
        message: abuseCheck.reasons[0]
      });
    } else {
      setAbuseWarning(null);
    }

    onSubmit(validSubstances);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Avertissement important</p>
          <p>Cet outil fournit une aide d'identification de risques basée sur des données publiques. 
          Toutes informations doivent être vérifiées par un responsable HSE. 
          Aucun protocole expérimental n'est fourni.</p>
        </div>
      </div>

      {abuseWarning && (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${
          abuseWarning.type === 'blocked' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <Ban className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            abuseWarning.type === 'blocked' ? 'text-red-600' : 'text-orange-600'
          }`} />
          <div className={`text-sm ${
            abuseWarning.type === 'blocked' ? 'text-red-800' : 'text-orange-800'
          }`}>
            <p className="font-medium mb-1">
              {abuseWarning.type === 'blocked' ? 'Requête bloquée' : 'Attention'}
            </p>
            <p>{abuseWarning.message}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-slate-900">
            Substances à analyser
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSubstance}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        <AnimatePresence>
          {substances.map((substance, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 rounded-xl"
            >
              <div className="md:col-span-5">
                <Label className="text-sm text-slate-600 mb-1.5 block">
                  Nom de la substance
                </Label>
                <Input
                  placeholder="Ex: Acide sulfurique"
                  value={substance.name}
                  onChange={(e) => updateSubstance(index, 'name', e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="md:col-span-3">
                <Label className="text-sm text-slate-600 mb-1.5 block">
                  Numéro CAS (optionnel)
                </Label>
                <Input
                  placeholder="Ex: 7664-93-9"
                  value={substance.cas}
                  onChange={(e) => updateSubstance(index, 'cas', e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="md:col-span-3">
                <Label className="text-sm text-slate-600 mb-1.5 block">
                  Rôle
                </Label>
                <select
                  value={substance.role}
                  onChange={(e) => updateSubstance(index, 'role', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                >
                  <option value="reactif">Réactif</option>
                  <option value="produit">Produit attendu</option>
                  <option value="solvant">Solvant</option>
                  <option value="catalyseur">Catalyseur</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="md:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubstance(index)}
                  disabled={substances.length === 1}
                  className="text-slate-400 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !substances.some(s => s.name.trim() || s.cas.trim())}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-base rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Lancer l'analyse RAMPE
          </>
        )}
      </Button>
    </form>
  );
}