import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-slate-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service ChemRisk Pro, 
            plateforme d'aide à l'identification des risques chimiques accessible via chemriskpro.com.
          </p>

          <h2>2. Description du Service</h2>
          <p>
            ChemRisk Pro est un outil d'aide à l'identification des risques chimiques utilisant l'intelligence artificielle. 
            Le Service permet de :
          </p>
          <ul>
            <li>Identifier les dangers associés aux substances chimiques</li>
            <li>Générer des tableaux RAMPE</li>
            <li>Extraire les codes H (dangers) et P (prudence)</li>
            <li>Obtenir des recommandations de protection (EPI)</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
            <h3 className="text-amber-800 mt-0">Avertissement important</h3>
            <p className="text-amber-700 mb-0">
              <strong>ChemRisk Pro est exclusivement un outil d'aide à l'identification des risques.</strong> 
              Il ne fournit AUCUN protocole expérimental, quantité, température, procédure ou étape de manipulation. 
              Toutes les informations doivent être vérifiées par un responsable HSE qualifié. 
              L'utilisation du Service ne remplace pas l'expertise d'un professionnel de la sécurité chimique.
            </p>
          </div>

          <h2>3. Accès au Service</h2>
          <h3>3.1 Inscription</h3>
          <p>
            L'utilisation du Service nécessite la création d'un compte. 
            L'utilisateur s'engage à fournir des informations exactes et à jour.
          </p>

          <h3>3.2 Essai gratuit</h3>
          <p>
            Un essai gratuit de 7 jours est proposé, limité à 10 analyses. 
            Aucune carte bancaire n'est requise pour l'essai.
          </p>

          <h3>3.3 Abonnements</h3>
          <p>
            Après l'essai, l'accès au Service nécessite un abonnement payant :
          </p>
          <ul>
            <li><strong>Standard :</strong> 29€/mois HT - 100 analyses/mois</li>
            <li><strong>Entreprise :</strong> 89€/mois HT - Analyses illimitées, multi-utilisateurs, API</li>
          </ul>

          <h2>4. Obligations de l'utilisateur</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul>
            <li>Utiliser le Service conformément aux lois en vigueur</li>
            <li>Ne pas utiliser le Service pour des activités illicites</li>
            <li>Vérifier toutes les informations fournies auprès d'un expert qualifié</li>
            <li>Ne pas tenter de contourner les limitations du Service</li>
            <li>Ne pas revendre ou redistribuer les résultats d'analyse</li>
          </ul>

          <h2>5. Limitation de responsabilité</h2>
          <p>
            <strong>ChemRisk Pro ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des informations fournies.</strong>
          </p>
          <p>
            Le Service est fourni "en l'état". ChemRisk Pro décline toute responsabilité pour :
          </p>
          <ul>
            <li>Les dommages directs ou indirects résultant de l'utilisation du Service</li>
            <li>Les erreurs, omissions ou inexactitudes dans les données</li>
            <li>Les décisions prises sur la base des informations fournies</li>
            <li>Les interruptions temporaires du Service</li>
          </ul>
          <p>
            L'utilisateur reste seul responsable de l'utilisation des informations et de leur vérification 
            auprès de professionnels qualifiés.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Le Service, son interface, ses algorithmes et sa documentation sont protégés par le droit d'auteur. 
            L'utilisateur dispose d'un droit d'usage non exclusif et non transférable pour son usage professionnel.
          </p>

          <h2>7. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est régi par notre Politique de Confidentialité. 
            ChemRisk Pro ne conserve jamais le contenu des analyses chimiques.
          </p>

          <h2>8. Paiement et facturation</h2>
          <ul>
            <li>Facturation mensuelle, en début de période</li>
            <li>Paiement par carte bancaire via Stripe</li>
            <li>TVA applicable selon le pays de l'utilisateur</li>
            <li>Factures conformes disponibles dans l'espace compte</li>
          </ul>

          <h2>9. Résiliation</h2>
          <h3>9.1 Par l'utilisateur</h3>
          <p>
            L'utilisateur peut résilier son abonnement à tout moment. 
            L'accès reste actif jusqu'à la fin de la période payée.
          </p>

          <h3>9.2 Par ChemRisk Pro</h3>
          <p>
            ChemRisk Pro peut suspendre ou résilier un compte en cas de :
          </p>
          <ul>
            <li>Violation des présentes CGU</li>
            <li>Non-paiement</li>
            <li>Usage frauduleux</li>
          </ul>

          <h2>10. Modifications</h2>
          <p>
            ChemRisk Pro peut modifier les présentes CGU. 
            Les utilisateurs seront informés 30 jours avant l'entrée en vigueur des modifications.
          </p>

          <h2>11. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. 
            En cas de litige, les tribunaux de Paris sont seuls compétents, 
            sous réserve des règles impératives de compétence au profit des consommateurs.
          </p>

          <h2>12. Contact</h2>
          <p>
            Pour toute question : support@chemriskpro.com
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}