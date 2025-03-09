import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import PlanDetails from './pages/PlanDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { useStore } from './store';

function App() {
  const loading = useStore((state) => state.loading);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/plan/:id" element={<PlanDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;