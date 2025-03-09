import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Save } from 'lucide-react';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import type { HousePlan, SearchFilters } from '../types';

export default function Search() {
  const navigate = useNavigate();
  const { filters, setFilters, setHousePlans, user } = useStore();
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<HousePlan[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase.from('house_plans').select('*');

      if (filters.style) {
        query = query.eq('style', filters.style);
      }
      if (filters.minBedrooms) {
        query = query.gte('bedrooms', filters.minBedrooms);
      }
      if (filters.maxBedrooms) {
        query = query.lte('bedrooms', filters.maxBedrooms);
      }
      if (filters.minFloorArea) {
        query = query.gte('floor_area', filters.minFloorArea);
      }
      if (filters.maxFloorArea) {
        query = query.lte('floor_area', filters.maxFloorArea);
      }
      if (filters.floors) {
        query = query.eq('floors', filters.floors);
      }
      if (filters.hasPool !== undefined) {
        query = query.eq('has_pool', filters.hasPool);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSearchResults(data);
      setHousePlans(data);
    } catch (error) {
      console.error('Erreur lors de la recherche des plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase.from('saved_searches').insert({
        user_id: user.id,
        name: 'Ma Recherche',
        filters,
      });
      if (error) throw error;
      alert('Recherche sauvegardée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la recherche:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rechercher des Plans de Maison</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtres
          </button>
          {user && (
            <button
              onClick={saveSearch}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Sauvegarder la Recherche
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.style || ''}
                onChange={(e) => setFilters({ ...filters, style: e.target.value })}
              >
                <option value="">Tous</option>
                <option value="modern">Moderne</option>
                <option value="traditional">Traditionnel</option>
                <option value="colonial">Colonial</option>
                <option value="mediterranean">Méditerranéen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambres
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg p-2"
                  value={filters.minBedrooms || ''}
                  onChange={(e) => setFilters({ ...filters, minBedrooms: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg p-2"
                  value={filters.maxBedrooms || ''}
                  onChange={(e) => setFilters({ ...filters, maxBedrooms: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (m²)
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg p-2"
                  value={filters.minFloorArea || ''}
                  onChange={(e) => setFilters({ ...filters, minFloorArea: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg p-2"
                  value={filters.maxFloorArea || ''}
                  onChange={(e) => setFilters({ ...filters, maxFloorArea: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg p-2"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg p-2"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
          </div>
        ) : (
          searchResults.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={plan.images[0]}
                alt={plan.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">
                  {plan.bedrooms} Chambres • {plan.bathrooms} Salles de bain • {plan.floorArea} m²
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">{plan.price.toLocaleString()} €</span>
                  <button
                    onClick={() => navigate(`/plan/${plan.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Voir les Détails
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}