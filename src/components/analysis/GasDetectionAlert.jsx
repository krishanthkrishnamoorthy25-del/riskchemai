import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wind, Skull, ShieldAlert } from 'lucide-react';

// Détection des gaz dangereux basée sur les réactions connues
const DANGEROUS_GAS_REACTIONS = [
  {
    reactant1: ['acide', 'acid', 'hcl', 'h2so4', 'hno3'],
    reactant2: ['sulfure', 'sulfide', 'na2s', 'h2s'],
    gas: 'H₂S',
    name: 'Sulfure d\'hydrogène',
    danger: 'Toxique mortel',
    tlv: '10 ppm',
    symptoms: 'Odeur d\'œuf pourri, irritation, perte de connaissance',
    color: 'red'
  },
  {
    reactant1: ['acide', 'acid', 'hcl', 'h2so4'],
    reactant2: ['cyanure', 'cyanide', 'kcn', 'nacn'],
    gas: 'HCN',
    name: 'Acide cyanhydrique',
    danger: 'Mortel',
    tlv: '4.7 ppm',
    symptoms: 'Odeur d\'amande amère, vertiges, arrêt respiratoire',
    color: 'red'
  },
  {
    reactant1: ['acide', 'acid', 'hcl', 'h2so4'],
    reactant2: ['hypochlorite', 'javel', 'naclo', 'eau de javel'],
    gas: 'Cl₂',
    name: 'Dichlore',
    danger: 'Toxique',
    tlv: '0.5 ppm',
    symptoms: 'Odeur piquante, irritation voies respiratoires, œdème pulmonaire',
    color: 'orange'
  },
  {
    reactant1: ['acide', 'acid'],
    reactant2: ['carbonate', 'bicarbonate', 'caco3', 'nahco3'],
    gas: 'CO₂',
    name: 'Dioxyde de carbone',
    danger: 'Asphyxiant',
    tlv: '5000 ppm',
    symptoms: 'Risque d\'asphyxie en espace confiné',
    color: 'yellow'
  },
  {
    reactant1: ['acide', 'acid', 'hcl', 'h2so4'],
    reactant2: ['métal', 'zinc', 'aluminium', 'fer', 'magnésium', 'sodium', 'zn', 'al', 'fe', 'mg', 'na'],
    gas: 'H₂',
    name: 'Dihydrogène',
    danger: 'Inflammable explosif',
    tlv: 'N/A',
    symptoms: 'Risque d\'explosion avec air (4-75%)',
    color: 'orange'
  },
  {
    reactant1: ['ammoni', 'nh3', 'nh4'],
    reactant2: ['hypochlorite', 'javel', 'naclo'],
    gas: 'NH₂Cl / NCl₃',
    name: 'Chloramines',
    danger: 'Toxique irritant',
    tlv: '0.5 ppm',
    symptoms: 'Irritation sévère, toux, détresse respiratoire',
    color: 'orange'
  },
  {
    reactant1: ['acide nitrique', 'hno3'],
    reactant2: ['métal', 'cuivre', 'cu'],
    gas: 'NO₂',
    name: 'Dioxyde d\'azote',
    danger: 'Toxique',
    tlv: '3 ppm',
    symptoms: 'Gaz brun-rouge, irritation pulmonaire, œdème différé',
    color: 'orange'
  },
  {
    reactant1: ['acide fluorhydrique', 'hf'],
    reactant2: ['verre', 'silice', 'sio2'],
    gas: 'SiF₄',
    name: 'Tétrafluorure de silicium',
    danger: 'Toxique corrosif',
    tlv: '2.5 ppm',
    symptoms: 'Irritation sévère, brûlures',
    color: 'red'
  }
];

export default function GasDetectionAlert({ substances = [] }) {
  if (!substances || substances.length < 2) return null;

  const substanceNames = substances.map(s => (s.name || '').toLowerCase());
  
  // Détecter les gaz potentiels
  const detectedGases = [];
  
  DANGEROUS_GAS_REACTIONS.forEach(reaction => {
    const hasReactant1 = substanceNames.some(name => 
      reaction.reactant1.some(r => name.includes(r))
    );
    const hasReactant2 = substanceNames.some(name => 
      reaction.reactant2.some(r => name.includes(r))
    );
    
    if (hasReactant1 && hasReactant2) {
      detectedGases.push(reaction);
    }
  });

  if (detectedGases.length === 0) return null;

  const getColorClasses = (color) => {
    switch(color) {
      case 'red': return 'bg-red-50 border-red-300 text-red-800';
      case 'orange': return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default: return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  const getBadgeColor = (color) => {
    switch(color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="border-red-300 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-red-800">
          <Skull className="w-5 h-5" />
          ⚠️ ALERTE : Dégagements Gazeux Dangereux Détectés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            Le mélange de ces substances peut produire des gaz toxiques ou dangereux.
            Manipulation sous sorbonne OBLIGATOIRE.
          </p>
        </div>

        <div className="space-y-3">
          {detectedGases.map((gas, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-2 ${getColorClasses(gas.color)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  <span className="font-bold text-lg">{gas.gas}</span>
                  <span className="text-sm">({gas.name})</span>
                </div>
                <Badge className={getBadgeColor(gas.color)}>
                  {gas.danger}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="font-medium">TLV/VLEP : </span>
                  <span>{gas.tlv}</span>
                </div>
                <div>
                  <span className="font-medium">Symptômes : </span>
                  <span>{gas.symptoms}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border border-red-200 rounded-lg">
          <p className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Mesures de protection obligatoires
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Manipulation sous sorbonne avec extraction fonctionnelle</li>
            <li>• Détecteur de gaz spécifique recommandé</li>
            <li>• Masque à cartouche adapté à proximité</li>
            <li>• Ne jamais travailler seul</li>
            <li>• Connaître l'emplacement des douches de sécurité</li>
            <li>• Numéro d'urgence : Centre Antipoison 01 40 05 48 48</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}