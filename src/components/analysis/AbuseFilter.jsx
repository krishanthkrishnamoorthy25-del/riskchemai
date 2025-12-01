// Liste des termes interdits pour filtrer les requêtes suspectes
const BLOCKED_TERMS = [
  // Explosifs
  'explosif', 'explosive', 'bombe', 'détonateur', 'détonation', 'tnt', 'c4', 'rdx', 'petn',
  'nitroglycérine', 'nitroglycerin', 'dynamite', 'semtex', 'anfo', 'tatp', 'hmtd',
  'fulminant', 'fulminate', 'azoture', 'azide', 'perchlorate', 'picrique', 'picric',
  
  // Armes chimiques
  'sarin', 'vx', 'novichok', 'tabun', 'soman', 'agent orange', 'ypérite', 'mustard gas',
  'gaz moutarde', 'lewisite', 'phosgène', 'phosgene', 'arme chimique', 'chemical weapon',
  'agent neurotoxique', 'nerve agent', 'chloropicrine',
  
  // Drogues / stupéfiants
  'méthamphétamine', 'methamphetamine', 'crystal meth', 'mdma', 'ecstasy',
  'lsd', 'lysergique', 'lysergic', 'héroïne', 'heroin', 'fentanyl', 'carfentanil',
  'cocaïne', 'cocaine', 'crack', 'ghb', 'kétamine', 'ketamine', 'pcp', 'angel dust',
  'amphétamine', 'amphetamine', 'speed', 'cathinone', 'méphedrone', 'mephedrone',
  
  // Poisons
  'ricine', 'ricin', 'abrine', 'botulique', 'botulinum', 'anthrax', 'cyanure',
  'cyanide', 'arsenic', 'thallium', 'polonium', 'aconit', 'aconitine',
  
  // Termes de synthèse
  'synthèse clandestine', 'fabrication illégale', 'cook meth', 'make bomb',
  'fabriquer explosif', 'recette drogue', 'drug recipe', 'how to make'
];

// Termes qui déclenchent une alerte mais ne bloquent pas
const WARNING_TERMS = [
  'précurseur', 'precursor', 'anhydride acétique', 'acetic anhydride',
  'éphédrine', 'ephedrine', 'pseudoéphédrine', 'pseudoephedrine',
  'permanganate', 'red phosphorus', 'phosphore rouge', 'iode', 'iodine',
  'acide sulfurique concentré', 'concentrated sulfuric', 'acide nitrique fumant',
  'fuming nitric', 'hydrazine', 'peroxyde concentré', 'concentrated peroxide'
];

/**
 * Vérifie si une requête contient des termes interdits
 * @param {string} query - La requête à vérifier
 * @returns {object} - { blocked: boolean, warning: boolean, reason: string }
 */
export function checkForAbuse(query) {
  if (!query || typeof query !== 'string') {
    return { blocked: false, warning: false, reason: null };
  }

  const normalizedQuery = query.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents

  // Check for blocked terms
  for (const term of BLOCKED_TERMS) {
    const normalizedTerm = term.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    if (normalizedQuery.includes(normalizedTerm)) {
      return {
        blocked: true,
        warning: false,
        reason: `Requête bloquée : cette recherche n'est pas autorisée pour des raisons de sécurité.`
      };
    }
  }

  // Check for warning terms
  for (const term of WARNING_TERMS) {
    const normalizedTerm = term.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    if (normalizedQuery.includes(normalizedTerm)) {
      return {
        blocked: false,
        warning: true,
        reason: `Attention : cette substance est un précurseur réglementé. L'usage est soumis à autorisation.`
      };
    }
  }

  return { blocked: false, warning: false, reason: null };
}

/**
 * Vérifie une liste de substances
 * @param {Array} substances - Liste des substances à vérifier
 * @returns {object} - Résultat de la vérification
 */
export function checkSubstancesForAbuse(substances) {
  if (!Array.isArray(substances)) {
    return { blocked: false, warning: false, reasons: [] };
  }

  const results = {
    blocked: false,
    warning: false,
    reasons: []
  };

  for (const substance of substances) {
    const nameCheck = checkForAbuse(substance.name || '');
    const casCheck = checkForAbuse(substance.cas || '');

    if (nameCheck.blocked || casCheck.blocked) {
      results.blocked = true;
      results.reasons.push(nameCheck.reason || casCheck.reason);
    }

    if (nameCheck.warning || casCheck.warning) {
      results.warning = true;
      if (nameCheck.reason) results.reasons.push(nameCheck.reason);
      if (casCheck.reason) results.reasons.push(casCheck.reason);
    }
  }

  // Remove duplicates
  results.reasons = [...new Set(results.reasons)];

  return results;
}

export default { checkForAbuse, checkSubstancesForAbuse };