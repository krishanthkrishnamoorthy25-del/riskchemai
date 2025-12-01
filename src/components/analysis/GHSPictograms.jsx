import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Données complètes des pictogrammes GHS
const GHS_DATA = {
  GHS01: {
    name: 'Explosif',
    description: 'Substances et mélanges explosibles, autoréactifs ou peroxydes organiques pouvant exploser sous l\'effet de la chaleur, d\'un choc, de frottements ou d\'une étincelle.',
    dangers: [
      'Explosif instable',
      'Explosif: danger d\'explosion en masse',
      'Explosif: danger sérieux de projection',
      'Explosif: danger d\'incendie, d\'effet de souffle ou de projection',
      'Peut exploser en masse en cas d\'incendie'
    ],
    precautions: [
      'Obtenir des instructions spéciales avant utilisation',
      'Ne pas manipuler avant d\'avoir lu et compris toutes les précautions',
      'Tenir à l\'écart de la chaleur, des surfaces chaudes, des étincelles',
      'Porter des gants, vêtements et équipement de protection'
    ],
    color: '#FF0000'
  },
  GHS02: {
    name: 'Inflammable',
    description: 'Substances et mélanges inflammables: gaz, aérosols, liquides, solides ou substances autoréactives pouvant s\'enflammer facilement.',
    dangers: [
      'Gaz extrêmement inflammable',
      'Liquide et vapeurs très inflammables',
      'Solide inflammable',
      'Peut s\'enflammer spontanément au contact de l\'air',
      'Matière auto-échauffante'
    ],
    precautions: [
      'Tenir à l\'écart de la chaleur, des étincelles, des flammes nues',
      'Ne pas vaporiser vers une flamme nue',
      'Garder le récipient bien fermé',
      'Stocker dans un endroit bien ventilé'
    ],
    color: '#FF4500'
  },
  GHS03: {
    name: 'Comburant',
    description: 'Substances et mélanges comburants qui peuvent provoquer ou aggraver un incendie ou une explosion en présence de matières combustibles.',
    dangers: [
      'Peut provoquer ou aggraver un incendie',
      'Peut provoquer un incendie ou une explosion',
      'Comburant puissant'
    ],
    precautions: [
      'Tenir à l\'écart de la chaleur',
      'Tenir à l\'écart des vêtements et matières combustibles',
      'Porter des gants et vêtements de protection',
      'En cas d\'incendie: ne pas utiliser d\'eau'
    ],
    color: '#FFD700'
  },
  GHS04: {
    name: 'Gaz sous pression',
    description: 'Gaz comprimés, liquéfiés, dissous ou réfrigérés sous pression. Risque d\'explosion sous l\'effet de la chaleur.',
    dangers: [
      'Contient un gaz sous pression',
      'Peut exploser sous l\'effet de la chaleur',
      'Contient un gaz réfrigéré: peut causer des brûlures cryogéniques'
    ],
    precautions: [
      'Protéger du rayonnement solaire',
      'Stocker dans un endroit bien ventilé',
      'Porter des gants isolants et un équipement de protection des yeux'
    ],
    color: '#00CED1'
  },
  GHS05: {
    name: 'Corrosif',
    description: 'Substances et mélanges corrosifs pouvant attaquer ou détruire les métaux et provoquer des lésions oculaires ou cutanées graves.',
    dangers: [
      'Peut être corrosif pour les métaux',
      'Provoque des brûlures de la peau',
      'Provoque de graves lésions des yeux',
      'Provoque des lésions oculaires graves'
    ],
    precautions: [
      'Ne pas respirer les vapeurs',
      'Se laver soigneusement après manipulation',
      'Porter des gants, vêtements et protection oculaire',
      'Stocker dans un récipient résistant à la corrosion'
    ],
    color: '#8B008B'
  },
  GHS06: {
    name: 'Toxicité aiguë',
    description: 'Substances et mélanges très toxiques pouvant entraîner la mort ou des effets graves même à faible dose par voie orale, cutanée ou par inhalation.',
    dangers: [
      'Mortel en cas d\'ingestion',
      'Mortel par contact cutané',
      'Mortel par inhalation',
      'Toxique en cas d\'ingestion/contact cutané/inhalation'
    ],
    precautions: [
      'Ne pas manger, boire ou fumer en manipulant',
      'Éviter tout contact avec la peau et les yeux',
      'Porter des gants, vêtements et masque de protection',
      'En cas d\'exposition: appeler un centre antipoison'
    ],
    color: '#DC143C'
  },
  GHS07: {
    name: 'Nocif / Irritant',
    description: 'Substances et mélanges nocifs, irritants pour la peau, les yeux ou les voies respiratoires, ou pouvant provoquer des allergies cutanées.',
    dangers: [
      'Nocif en cas d\'ingestion/contact cutané/inhalation',
      'Provoque une irritation cutanée',
      'Provoque une sévère irritation des yeux',
      'Peut provoquer une allergie cutanée',
      'Peut provoquer somnolence ou vertiges'
    ],
    precautions: [
      'Éviter de respirer les vapeurs',
      'Se laver les mains après manipulation',
      'Utiliser uniquement en extérieur ou dans un endroit bien ventilé',
      'Porter des gants de protection'
    ],
    color: '#FF8C00'
  },
  GHS08: {
    name: 'Danger pour la santé',
    description: 'Substances et mélanges présentant des dangers graves pour la santé: cancérogénicité, mutagénicité, toxicité pour la reproduction, sensibilisation respiratoire.',
    dangers: [
      'Peut provoquer le cancer',
      'Peut induire des anomalies génétiques',
      'Peut nuire à la fertilité ou au fœtus',
      'Peut provoquer des symptômes allergiques respiratoires',
      'Peut être mortel en cas d\'ingestion et de pénétration dans les voies respiratoires',
      'Risque d\'effets graves pour les organes'
    ],
    precautions: [
      'Obtenir des instructions spéciales avant utilisation',
      'Ne pas manipuler avant d\'avoir lu toutes les précautions',
      'Utiliser l\'équipement de protection requis',
      'En cas d\'exposition: consulter un médecin'
    ],
    color: '#FF1493'
  },
  GHS09: {
    name: 'Danger pour l\'environnement',
    description: 'Substances et mélanges dangereux pour l\'environnement aquatique, toxiques pour les organismes aquatiques avec des effets à long terme.',
    dangers: [
      'Très toxique pour les organismes aquatiques',
      'Toxique pour les organismes aquatiques',
      'Entraîne des effets néfastes à long terme',
      'Nocif pour la faune aquatique'
    ],
    precautions: [
      'Éviter le rejet dans l\'environnement',
      'Recueillir le produit répandu',
      'Éliminer le contenu conformément aux règlements',
      'Ne pas rejeter dans les égouts'
    ],
    color: '#228B22'
  }
};

// Composant SVG pour chaque pictogramme
function PictogramSVG({ code, size = 48 }) {
  const baseStyle = {
    width: size,
    height: size
  };

  const renderPictogram = () => {
    switch(code) {
      case 'GHS01': // Explosif
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <circle cx="50" cy="42" r="6" fill="#000"/>
            <path d="M44 50 L38 68 M50 52 L50 72 M56 50 L62 68" stroke="#000" strokeWidth="3" fill="none"/>
            <path d="M40 38 L28 28 M60 38 L72 28 M46 34 L42 18 M54 34 L58 18" stroke="#000" strokeWidth="3" fill="none"/>
          </svg>
        );
      case 'GHS02': // Inflammable
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <path d="M50 78 C32 78 26 62 26 50 C26 38 38 32 44 20 C44 32 56 38 56 50 C62 44 56 32 56 20 C68 32 74 44 74 56 C74 68 66 78 50 78 Z" fill="#000"/>
          </svg>
        );
      case 'GHS03': // Comburant
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <circle cx="50" cy="58" r="16" fill="#000"/>
            <path d="M50 22 L46 42 L54 42 Z" fill="#000"/>
            <path d="M32 32 L40 46 L48 42 Z" fill="#000"/>
            <path d="M68 32 L60 46 L52 42 Z" fill="#000"/>
          </svg>
        );
      case 'GHS04': // Gaz sous pression
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <ellipse cx="50" cy="52" rx="18" ry="24" fill="none" stroke="#000" strokeWidth="4"/>
            <rect x="44" y="24" width="12" height="8" fill="#000"/>
            <line x1="50" y1="28" x2="50" y2="20" stroke="#000" strokeWidth="3"/>
          </svg>
        );
      case 'GHS05': // Corrosif
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <path d="M28 30 L34 30 L34 42 L40 54 L22 54 L28 42 Z" fill="#000"/>
            <path d="M30 58 L32 72 L26 78 L40 78 L34 72 Z" fill="#000"/>
            <path d="M60 30 L72 30 L72 42 L78 54 L54 54 L60 42 Z" fill="#000"/>
            <ellipse cx="66" cy="72" rx="10" ry="6" fill="#000"/>
            <path d="M62 58 L68 66" stroke="#000" strokeWidth="2"/>
          </svg>
        );
      case 'GHS06': // Toxicité aiguë
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <circle cx="50" cy="32" r="12" fill="#000"/>
            <circle cx="45" cy="30" r="3" fill="#FF0000"/>
            <circle cx="55" cy="30" r="3" fill="#FF0000"/>
            <ellipse cx="50" cy="38" rx="4" ry="2" fill="#FF0000"/>
            <rect x="46" y="44" width="8" height="24" fill="#000"/>
            <rect x="32" y="48" width="36" height="6" fill="#000"/>
            <rect x="38" y="68" width="10" height="14" fill="#000"/>
            <rect x="52" y="68" width="10" height="14" fill="#000"/>
          </svg>
        );
      case 'GHS07': // Nocif/Irritant
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <line x1="26" y1="26" x2="74" y2="74" stroke="#000" strokeWidth="8"/>
            <line x1="74" y1="26" x2="26" y2="74" stroke="#000" strokeWidth="8"/>
          </svg>
        );
      case 'GHS08': // Danger pour la santé
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <path d="M32 26 L32 74 L50 56 L68 74 L68 26 L50 44 Z" fill="#000"/>
            <circle cx="50" cy="50" r="8" fill="#FF0000"/>
          </svg>
        );
      case 'GHS09': // Environnement
        return (
          <svg viewBox="0 0 100 100" style={baseStyle}>
            <polygon points="50,2 98,50 50,98 2,50" fill="#FF0000" stroke="#000" strokeWidth="2"/>
            <ellipse cx="50" cy="72" rx="28" ry="10" fill="#000"/>
            <path d="M32 66 C32 48 44 42 50 30 C56 42 68 48 68 66" fill="#000"/>
            <path d="M56 54 C62 48 68 54 62 60 C56 66 50 60 56 54" fill="#000"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return renderPictogram();
}

export function GHSPictogram({ code, size = 48, onClick }) {
  const data = GHS_DATA[code];
  if (!data) return null;

  return (
    <button 
      onClick={() => onClick && onClick(code)}
      className="cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
      title={`${code} - ${data.name}`}
    >
      <PictogramSVG code={code} size={size} />
    </button>
  );
}

export function GHSPictogramRow({ codes, size = 48 }) {
  const [selectedCode, setSelectedCode] = useState(null);
  
  if (!codes || codes.length === 0) return null;

  const selectedData = selectedCode ? GHS_DATA[selectedCode] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {codes.map((code) => (
          <GHSPictogram 
            key={code} 
            code={code} 
            size={size} 
            onClick={setSelectedCode}
          />
        ))}
      </div>

      <Dialog open={!!selectedCode} onOpenChange={() => setSelectedCode(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCode && <PictogramSVG code={selectedCode} size={56} />}
              <div>
                <span className="text-lg font-bold">{selectedCode}</span>
                <span className="text-slate-500 ml-2">- {selectedData?.name}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedData && (
            <div className="space-y-4">
              <p className="text-slate-700">{selectedData.description}</p>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-2">⚠️ Dangers</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {selectedData.dangers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🛡️ Précautions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  {selectedData.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GHSPictogram;