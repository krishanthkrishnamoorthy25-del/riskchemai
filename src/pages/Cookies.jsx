import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Politique de cookies
            </h1>
            <p className="text-slate-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
            lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, 
            comme votre langue préférée et d'autres paramètres. Cela peut faciliter votre prochaine visite 
            et rendre le site plus utile pour vous.
          </p>

          <h2>2. Types de cookies utilisés</h2>
          
          <h3>2.1 Cookies strictement nécessaires (obligatoires)</h3>
          <p>
            Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. 
            Ils sont généralement établis en réponse à des actions que vous effectuez et qui correspondent 
            à une demande de services, comme la définition de vos préférences de confidentialité, 
            la connexion ou le remplissage de formulaires.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintien de la session utilisateur</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>auth_token</td>
                <td>Authentification sécurisée</td>
                <td>7 jours</td>
              </tr>
              <tr>
                <td>cookie_consent</td>
                <td>Mémorisation de vos choix de cookies</td>
                <td>1 an</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Cookies analytiques (optionnels)</h3>
          <p>
            Ces cookies nous permettent de mesurer l'audience du site et de comprendre comment les visiteurs l'utilisent. 
            Toutes les données sont anonymisées.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - Distinction des utilisateurs</td>
                <td>2 ans</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - Distinction des utilisateurs</td>
                <td>24h</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 Cookies marketing (optionnels)</h3>
          <p>
            Ces cookies peuvent être utilisés pour vous proposer des publicités pertinentes. 
            Ils sont entièrement optionnels et désactivés par défaut.
          </p>

          <h2>3. Gestion de vos préférences</h2>
          <p>
            Lors de votre première visite, une bannière vous permet de choisir quels cookies vous acceptez. 
            Vous pouvez modifier vos choix à tout moment en cliquant sur "Paramètres des cookies" en bas de page.
          </p>

          <h3>3.1 Via votre navigateur</h3>
          <p>
            Vous pouvez également configurer votre navigateur pour refuser tous les cookies ou être alerté 
            lorsqu'un cookie est envoyé. Les liens ci-dessous vous indiquent comment procéder :
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener">Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener">Edge</a></li>
          </ul>

          <h2>4. Données collectées</h2>
          <p>
            Les cookies analytiques collectent des informations anonymisées telles que :
          </p>
          <ul>
            <li>Pages visitées</li>
            <li>Temps passé sur le site</li>
            <li>Source de trafic</li>
            <li>Type d'appareil et navigateur</li>
          </ul>
          <p>
            <strong>Aucune donnée d'analyse chimique n'est jamais collectée par les cookies.</strong>
          </p>

          <h2>5. Base légale</h2>
          <ul>
            <li><strong>Cookies nécessaires :</strong> intérêt légitime (fonctionnement du service)</li>
            <li><strong>Cookies analytiques et marketing :</strong> consentement préalable</li>
          </ul>

          <h2>6. Durée de conservation</h2>
          <p>
            Conformément aux recommandations de la CNIL, les cookies ont une durée de vie maximale de 13 mois. 
            Votre consentement est redemandé au-delà de cette période.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question relative aux cookies : privacy@chemriskpro.com
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}