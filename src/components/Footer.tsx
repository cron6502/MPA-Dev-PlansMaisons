import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
            <div className="space-y-2">
              <a href="mailto:contact@houseplans.com" className="flex items-center space-x-2 hover:text-blue-400">
                <Mail className="w-5 h-5" />
                <span>contact@houseplans.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center space-x-2 hover:text-blue-400">
                <Phone className="w-5 h-5" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>123 Rue de l'Architecture, Ville Design</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-400">À Propos</a></li>
              <li><a href="/terms" className="hover:text-blue-400">Conditions d'Utilisation</a></li>
              <li><a href="/privacy" className="hover:text-blue-400">Politique de Confidentialité</a></li>
              <li><a href="/faq" className="hover:text-blue-400">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Plans de Maison. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}