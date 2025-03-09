import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const user = useStore((state) => state.user);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Plans de Maison</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </Link>
            
            <Link
              to={user ? '/profile' : '/login'}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              <span>{user ? 'Profil' : 'Connexion'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}