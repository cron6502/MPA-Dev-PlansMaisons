import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { User, Settings, Heart, Search as SearchIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import type { HousePlan } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [favorites, setFavorites] = useState<HousePlan[]>([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch favorites
        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('house_plans(*)')
          .eq('user_id', user.id);

        setFavorites(favoritesData?.map(f => f.house_plans) || []);

        // Fetch saved searches
        const { data: searchesData } = await supabase
          .from('saved_searches')
          .select('*')
          .eq('user_id', user.id);

        setSavedSearches(searchesData || []);

        // Fetch view history (simulated data for demo)
        setViewHistory([
          { date: '2024-01', views: 12 },
          { date: '2024-02', views: 19 },
          { date: '2024-03', views: 15 },
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex space-x-6">
        <div className="w-64 bg-white rounded-lg shadow-lg p-6 h-fit">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favoris</span>
            </button>
            <button
              onClick={() => setActiveTab('searches')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'searches'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <SearchIcon className="w-5 h-5" />
              <span>Recherches Sauvegardées</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Paramètres</span>
            </button>
          </nav>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="flex-grow">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Aperçu de l'Activité</h2>
              <div className="h-64">
                <Line
                  data={{
                    labels: viewHistory.map(h => h.date),
                    datasets: [
                      {
                        label: 'Vues',
                        data: viewHistory.map(h => h.views),
                        borderColor: 'rgb(59, 130, 246)',
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Plans Favoris</h2>
              <div className="grid grid-cols-2 gap-6">
                {favorites.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white border rounded-lg overflow-hidden"
                  >
                    <img
                      src={plan.images[0]}
                      alt={plan.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                      <p className="text-gray-600">
                        {plan.bedrooms} Chambres • {plan.bathrooms} Salles de bain
                      </p>
                      <button
                        onClick={() => navigate(`/plan/${plan.id}`)}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Voir les Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Recherches Sauvegardées</h2>
              <div className="space-y-4">
                {savedSearches.map((search: any) => (
                  <div
                    key={search.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold mb-2">{search.name}</h3>
                    <p className="text-gray-600">
                      {Object.entries(search.filters)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ')}
                    </p>
                    <button
                      onClick={() => navigate('/search', { state: { filters: search.filters } })}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Appliquer la Recherche
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Paramètres du Compte</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Changer le Mot de Passe
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Préférences de Notification
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Notifications par email pour les nouveaux plans
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Alertes de baisse de prix
                    </label>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}