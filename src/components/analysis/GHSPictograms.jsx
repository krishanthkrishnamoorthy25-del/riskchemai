import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// SVG Pictograms GHS
const pictogramSVGs = {
  GHS01: {
    name: 'Explosif',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <circle cx="50" cy="45" r="8" fill="#000"/>
      <path d="M42 55 L35 70 M50 55 L50 75 M58 55 L65 70 M38 40 L25 30 M62 40 L75 30 M45 35 L40 20 M55 35 L60 20" stroke="#000" stroke-width="3" fill="none"/>
    </svg>`
  },
  GHS02: {
    name: 'Inflammable',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <path d="M50 75 C35 75 30 60 30 50 C30 40 40 35 45 25 C45 35 55 40 55 50 C60 45 55 35 55 25 C65 35 70 45 70 55 C70 65 65 75 50 75 Z" fill="#000"/>
    </svg>`
  },
  GHS03: {
    name: 'Comburant',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <circle cx="50" cy="55" r="15" fill="#000"/>
      <path d="M50 25 L45 40 L55 40 Z" fill="#000"/>
      <path d="M35 35 L42 45 L48 42 Z" fill="#000"/>
      <path d="M65 35 L58 45 L52 42 Z" fill="#000"/>
    </svg>`
  },
  GHS04: {
    name: 'Gaz sous pression',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <ellipse cx="50" cy="50" rx="20" ry="25" fill="none" stroke="#000" stroke-width="4"/>
      <line x1="50" y1="25" x2="50" y2="20" stroke="#000" stroke-width="4"/>
      <rect x="45" y="15" width="10" height="8" fill="#000"/>
    </svg>`
  },
  GHS05: {
    name: 'Corrosif',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <path d="M30 35 L35 35 L35 45 L40 55 L25 55 L30 45 Z" fill="#000"/>
      <path d="M32 58 L33 70 L28 75 L38 75 L33 70 Z" fill="#000"/>
      <path d="M60 35 L70 35 L70 45 L75 55 L55 55 L60 45 Z" fill="#000"/>
      <path d="M62 58 L67 65 L72 65 L67 75 L57 75 L62 65 Z" fill="#000"/>
      <ellipse cx="65" cy="75" rx="8" ry="3" fill="#000"/>
    </svg>`
  },
  GHS06: {
    name: 'Toxicité aiguë',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <circle cx="50" cy="35" r="12" fill="#000"/>
      <circle cx="45" cy="33" r="3" fill="#FF0000"/>
      <circle cx="55" cy="33" r="3" fill="#FF0000"/>
      <ellipse cx="50" cy="40" rx="4" ry="2" fill="#FF0000"/>
      <rect x="47" y="47" width="6" height="25" fill="#000"/>
      <rect x="35" y="50" width="30" height="5" fill="#000"/>
      <rect x="40" y="72" width="8" height="10" fill="#000"/>
      <rect x="52" y="72" width="8" height="10" fill="#000"/>
    </svg>`
  },
  GHS07: {
    name: 'Nocif / Irritant',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <line x1="30" y1="30" x2="70" y2="70" stroke="#000" stroke-width="6"/>
      <line x1="70" y1="30" x2="30" y2="70" stroke="#000" stroke-width="6"/>
    </svg>`
  },
  GHS08: {
    name: 'Danger pour la santé',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <path d="M35 30 L35 70 L50 55 L65 70 L65 30 L50 45 Z" fill="#000"/>
      <circle cx="50" cy="50" r="8" fill="#FF0000"/>
    </svg>`
  },
  GHS09: {
    name: 'Danger pour l\'environnement',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,50 50,95 5,50" fill="#FF0000" stroke="#000" stroke-width="2"/>
      <ellipse cx="50" cy="70" rx="25" ry="8" fill="#000"/>
      <path d="M35 65 C35 50 45 45 50 35 C55 45 65 50 65 65" fill="#000"/>
      <path d="M55 55 C60 50 65 55 60 60 C55 65 50 60 55 55" fill="#000"/>
    </svg>`
  }
};

export function GHSPictogram({ code, size = 48 }) {
  const pictogram = pictogramSVGs[code];
  if (!pictogram) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className="inline-block"
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: pictogram.svg }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{code}</p>
          <p className="text-xs text-slate-500">{pictogram.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function GHSPictogramRow({ codes, size = 40 }) {
  if (!codes || codes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {codes.map((code) => (
        <GHSPictogram key={code} code={code} size={size} />
      ))}
    </div>
  );
}

export default GHSPictogram;