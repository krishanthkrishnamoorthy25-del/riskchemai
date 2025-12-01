import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/landing/Footer';

export default function Legal() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Mentions légales
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate max-w-none">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site chemriskpro.com est édité par :<br />
            <strong>ChemRisk Pro SAS</strong><br />
            Société par Actions Simplifiée au capital de 10 000 €<br />
            Siège social : [Adresse à compléter]<br />
            RCS : [Numéro à compléter]<br />
            N° TVA intracommunautaire : [Numéro à compléter]
          </p>
          <p>
            <strong>Directeur de la publication :</strong> [Nom à compléter]<br />
            <strong>Contact :</strong> contact@chemriskpro.com
          </p>

          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par :<br />
            [Nom de l'hébergeur]<br />
            [Adresse de l'hébergeur]<br />
            Localisation des serveurs : Union Européenne
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant le site chemriskpro.com (textes, graphismes, logiciels, 
            photographies, images, sons, vidéos, plans, noms, logos, marques, créations et œuvres protégeables diverses, 
            bases de données, etc.) ainsi que le site lui-même, relèvent des législations françaises et internationales 
            sur le droit d'auteur et la propriété intellectuelle.
          </p>
          <p>
            Ces éléments sont la propriété exclusive de ChemRisk Pro SAS. 
            Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle 
            du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite 
            sans autorisation écrite préalable de ChemRisk Pro SAS.
          </p>

          <h2>4. Protection des données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
            vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant.
          </p>
          <p>
            <strong>Délégué à la protection des données (DPO) :</strong><br />
            Contact : privacy@chemriskpro.com
          </p>
          <p>
            Pour plus d'informations, consultez notre <a href="/Privacy">Politique de confidentialité</a>.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Le site utilise des cookies. Pour plus d'informations sur leur utilisation et leur gestion, 
            consultez notre <a href="/Cookies">Politique de cookies</a>.
          </p>

          <h2>6. Limitation de responsabilité</h2>
          <p>
            ChemRisk Pro SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. 
            Toutefois, ChemRisk Pro SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
            mises à disposition sur le site.
          </p>
          <p>
            <strong>En particulier, ChemRisk Pro est un outil d'aide à l'identification des risques chimiques. 
            Il ne constitue pas un conseil professionnel et ne remplace pas l'expertise d'un responsable HSE qualifié.</strong>
          </p>
          <p>
            ChemRisk Pro SAS décline toute responsabilité :
          </p>
          <ul>
            <li>pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
            <li>pour tous dommages résultant d'une intrusion frauduleuse d'un tiers</li>
            <li>pour tous dommages directs ou indirects résultant de l'utilisation du site ou des informations qu'il contient</li>
          </ul>

          <h2>7. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites. 
            ChemRisk Pro SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>

          <h2>8. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. 
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question concernant ces mentions légales :<br />
            Email : contact@chemriskpro.com
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}