import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FlaskConical } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: 'Fonctionnalités', page: 'Features' },
      { name: 'Tarifs', page: 'Pricing' },
      { name: 'Dashboard', page: 'Dashboard' },
      { name: 'Sources scientifiques', page: 'Sources' }
    ],
    legal: [
      { name: 'Mentions légales', page: 'Legal' },
      { name: 'Politique de confidentialité', page: 'Privacy' },
      { name: 'Cookies', page: 'Cookies' },
      { name: 'CGU', page: 'Terms' },
      { name: 'Avertissements', page: 'Disclaimer' }
    ],
    support: [
      { name: 'Centre d\'aide', page: 'Support' },
      { name: 'Sécurité', page: 'Security' },
      { name: 'Contact', page: 'Contact' },
      { name: 'À propos', page: 'About' },
      { name: 'Changelog', page: 'Changelog' }
      ]
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ChemRisk Pro</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plateforme d'analyse de risques chimiques par IA. 
              Conforme RGPD, données non conservées.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={createPageUrl(link.page)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={createPageUrl(link.page)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={createPageUrl(link.page)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <p className="text-slate-500 text-sm">
              Hébergé en Union Européenne 🇪🇺
            </p>
            <div className="flex items-center gap-6">
              <Link to={createPageUrl('Privacy')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Confidentialité
              </Link>
              <Link to={createPageUrl('Terms')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                CGU
              </Link>
              <Link to={createPageUrl('Cookies')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-xs">
              © {currentYear} ChemRisk Pro — Une solution développée en France 🇫🇷
            </p>
            <p className="text-slate-700 text-[10px] mt-1">
              ChemRisk Pro® est une marque déposée. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}