import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Heart, Download, MessageCircle, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import type { HousePlan, AdditionalService } from '../types';

export default function PlanDetails() {
  const { id } = useParams();
  const { user } = useStore();
  const [plan, setPlan] = useState<HousePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([]);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const canEditPrice = user?.role === 'professional' || user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger le plan
        const { data: planData, error: planError } = await supabase
          .from('house_plans')
          .select('*')
          .eq('id', id)
          .single();
        
        if (planError) throw planError;
        setPlan(planData);
        setNewPrice(planData.price);

        // Charger les services
        const { data: servicesData, error: servicesError } = await supabase
          .from('additional_services')
          .select('*')
          .order('is_default', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData);
        setSelectedServices(servicesData.filter(s => s.isDefault).map(s => s.id));

        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_id', id)
            .single();
          
          setIsFavorite(!!favData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handlePriceUpdate = async () => {
    if (!canEditPrice || !plan) return;

    try {
      const { error } = await supabase
        .from('house_plans')
        .update({ price: newPrice })
        .eq('id', plan.id);

      if (error) throw error;

      setPlan({ ...plan, price: newPrice });
      setIsEditingPrice(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = plan?.price || 0;
    const servicesPrice = services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
    return basePrice + servicesPrice;
  };

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('plan_id', id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, plan_id: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: 'user' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Merci pour votre message. Un agent vous répondra prochainement.",
        sender: 'system'
      }]);
    }, 1000);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!plan) {
    return <div>Plan non trouvé</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">{plan.title}</h1>
          <p className="text-xl text-gray-600">
            {plan.bedrooms} Chambres • {plan.bathrooms} Salles de bain • {plan.floorArea} m²
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">{plan.price.toLocaleString()} €</span>
            {canEditPrice && (
              isEditingPrice ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-32 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={handlePriceUpdate}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => setIsEditingPrice(false)}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingPrice(true)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full ${
              isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="p-2 rounded-full bg-blue-100 text-blue-600"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img
              src={plan.images[0]}
              alt={plan.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Détails</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Style</p>
                <p className="font-semibold">{plan.style}</p>
              </div>
              <div>
                <p className="text-gray-600">Étages</p>
                <p className="font-semibold">{plan.floors}</p>
              </div>
              <div>
                <p className="text-gray-600">Garages</p>
                <p className="font-semibold">{plan.garages}</p>
              </div>
              <div>
                <p className="text-gray-600">Piscine</p>
                <p className="font-semibold">{plan.hasPool ? 'Oui' : 'Non'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Budget Estimé</p>
                <p className="font-semibold">
                  {plan.estimatedBudget.toLocaleString()} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Services Complémentaires</h2>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="mt-1"
                  />
                  <label htmlFor={service.id} className="flex-grow">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                    <div className="text-sm font-semibold text-blue-600">
                      {service.price === 0 ? 'Inclus' : `${service.price.toLocaleString()} €`}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">{calculateTotalPrice().toLocaleString()} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Aperçu 3D</h2>
            <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Canvas>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <OrbitControls />
                  {/* 3D model would be loaded here */}
                </Suspense>
              </Canvas>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Plans d'Étage</h2>
            <div className="grid grid-cols-2 gap-4">
              {plan.plans2D.map((plan, index) => (
                <div key={index} className="relative group">
                  <img
                    src={plan}
                    alt={`Plan d'Étage ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-6 h-6 mr-2" />
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Discuter avec Nous</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
          <div className="h-96 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-grow p-2 border rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}