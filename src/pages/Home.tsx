import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] -mt-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative h-full container mx-auto flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Trouvez le Plan de Maison de vos Rêves</h1>
            <p className="text-xl mb-8">
              Parcourez des milliers de plans de maison conçus professionnellement et trouvez celui qui correspond à vos besoins.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Commencer la Recherche
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir Nos Plans de Maison ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <HomeIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Designs Personnalisables</h3>
            <p className="text-gray-600">
              Modifiez nos plans pour correspondre à vos besoins et préférences spécifiques.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Recherche Avancée</h3>
            <p className="text-gray-600">
              Trouvez le plan parfait grâce à nos filtres de recherche puissants.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Budget Maîtrisé</h3>
            <p className="text-gray-600">
              Obtenez des designs professionnels à une fraction du coût d'une architecture sur mesure.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-16 bg-gray-100 -mx-4 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Plans de Maison en Vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={`https://images.unsplash.com/photo-${1600607687920 + i}-8b9bfb2a27b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                alt={`Plan en Vedette ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Villa Moderne Plan {i}</h3>
                <p className="text-gray-600 mb-4">
                  4 Chambres • 3 Salles de bain • 232 m²
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">1 000 €</span>
                  <Link
                    to={`/plan/${i}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Voir les Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}