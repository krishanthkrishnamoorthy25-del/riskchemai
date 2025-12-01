import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Politique de confidentialité
            </h1>
            <p className="text-slate-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Introduction</h2>
          <p>
            ChemRisk Pro (ci-après "le Service") s'engage à protéger la vie privée de ses utilisateurs. 
            Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles 
            conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>

          <h2>2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est ChemRisk Pro SAS.<br />
            Pour toute question relative à vos données personnelles, vous pouvez nous contacter à : privacy@chemriskpro.com
          </p>

          <h2>3. Données collectées</h2>
          <h3>3.1 Données de compte</h3>
          <ul>
            <li>Adresse email</li>
            <li>Nom complet</li>
            <li>Organisation (optionnel)</li>
            <li>Pays (pour la facturation)</li>
          </ul>

          <h3>3.2 Données de facturation</h3>
          <ul>
            <li>Informations de paiement (traitées par Stripe, jamais stockées sur nos serveurs)</li>
            <li>Historique des factures</li>
            <li>Statut d'abonnement</li>
          </ul>

          <h3>3.3 Données d'utilisation</h3>
          <ul>
            <li>Nombre d'analyses effectuées (métadonnée uniquement)</li>
            <li>Date des analyses</li>
            <li>Format d'export utilisé</li>
          </ul>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-6">
            <h3 className="text-emerald-800 mt-0">Important : Données d'analyse chimique</h3>
            <p className="text-emerald-700 mb-0">
              <strong>ChemRisk Pro ne stocke JAMAIS le contenu de vos analyses chimiques.</strong> 
              Les requêtes (noms de substances, numéros CAS, résultats d'analyse) sont traitées en mémoire 
              et immédiatement supprimées après génération du résultat. Seules les métadonnées anonymisées 
              (nombre de substances, date) sont conservées pour votre historique.
            </p>
          </div>

          <h2>4. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Fournir et améliorer le Service</li>
            <li>Gérer votre compte et abonnement</li>
            <li>Traiter les paiements</li>
            <li>Vous envoyer des communications relatives au Service</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>5. Base légale du traitement</h2>
          <ul>
            <li><strong>Exécution du contrat :</strong> pour la fourniture du Service</li>
            <li><strong>Obligation légale :</strong> conservation des factures, conformité fiscale</li>
            <li><strong>Intérêt légitime :</strong> amélioration du Service, sécurité</li>
            <li><strong>Consentement :</strong> cookies analytiques et marketing (optionnel)</li>
          </ul>

          <h2>6. Durée de conservation</h2>
          <ul>
            <li><strong>Données de compte :</strong> pendant la durée de votre abonnement + 30 jours après suppression</li>
            <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
            <li><strong>Métadonnées d'utilisation :</strong> 12 mois glissants</li>
            <li><strong>Données d'analyse chimique :</strong> 0 seconde (jamais stockées)</li>
          </ul>

          <h2>7. Vos droits RGPD</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> supprimer vos données (sous 30 jours)</li>
            <li><strong>Droit à la portabilité :</strong> exporter vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
          </ul>
          <p>
            Pour exercer ces droits, rendez-vous dans votre espace Compte ou contactez-nous à privacy@chemriskpro.com
          </p>

          <h2>8. Sécurité des données</h2>
          <ul>
            <li>Chiffrement TLS 1.3 pour toutes les communications</li>
            <li>Chiffrement AES-256 des données au repos</li>
            <li>Hébergement en Union Européenne</li>
            <li>Accès restreint et journalisé aux données</li>
            <li>Tests de sécurité réguliers</li>
          </ul>

          <h2>9. Sous-traitants</h2>
          <p>Nous faisons appel aux sous-traitants suivants :</p>
          <ul>
            <li><strong>Stripe</strong> (États-Unis, certifié Privacy Shield) : paiements</li>
            <li><strong>Hébergeur cloud européen</strong> (UE) : infrastructure</li>
          </ul>

          <h2>10. Transferts internationaux</h2>
          <p>
            Vos données sont principalement traitées en Union Européenne. 
            En cas de transfert hors UE, nous nous assurons que des garanties appropriées sont en place 
            (Clauses Contractuelles Types, décision d'adéquation).
          </p>

          <h2>11. Modifications</h2>
          <p>
            Cette politique peut être modifiée. En cas de modification substantielle, 
            nous vous en informerons par email au moins 30 jours avant l'entrée en vigueur des changements.
          </p>

          <h2>12. Contact et réclamation</h2>
          <p>
            Pour toute question : privacy@chemriskpro.com<br />
            Vous pouvez également introduire une réclamation auprès de la CNIL : www.cnil.fr
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}