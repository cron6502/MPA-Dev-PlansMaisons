import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { UserRole } from '../types';
import PasswordValidation from '../components/PasswordValidation';
import VerificationCode from '../components/VerificationCode';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('visitor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [storedCode, setStoredCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (code: string) => {
    try {
      // First, create the user with email confirmation disabled
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
            verification_code: code
          },
          emailRedirectTo: `${window.location.origin}/verify`
        }
      });

      if (signUpError) throw signUpError;

      // Send custom email with verification code using Supabase Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          code,
          redirectUrl: `${window.location.origin}/verify`
        }
      });

      if (emailError) throw emailError;
      
      setStoredCode(code);
      setMessage('Un code de vérification a été envoyé à votre adresse email');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du code:', error);
      setError(error.message || 'Impossible d\'envoyer le code de vérification. Veuillez réessayer.');
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      setError('');
      setMessage('');
      
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }

      // Generate and send verification code
      const code = generateVerificationCode();
      const emailSent = await sendVerificationEmail(code);
      
      if (emailSent) {
        setVerificationStep(true);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleVerificationComplete = async (code: string) => {
    try {
      setError('');
      setMessage('');

      if (code !== storedCode) {
        setError('Code de vérification incorrect');
        return;
      }

      // Get the user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setError('Session non trouvée. Veuillez recommencer l\'inscription');
        return;
      }

      // Update user metadata to mark as verified
      const { error: updateError } = await supabase.auth.updateUser({
        data: { verified: true }
      });

      if (updateError) throw updateError;

      // Create user profile in the database
      const { error: profileError } = await supabase.from('users').insert({
        id: session.user.id,
        email: session.user.email,
        role: selectedRole,
        verified: true
      });

      if (profileError) throw profileError;

      setMessage('Votre compte a été vérifié avec succès !');
      setVerificationStep(false);
      setStoredCode('');
      
      // Redirect after successful verification
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      setError(error.message || 'Une erreur est survenue lors de la vérification');
    }
  };

  const handleSignIn = async () => {
    try {
      setError('');
      setMessage('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        // Check if user is verified
        const { data: userData } = await supabase
          .from('users')
          .select('verified')
          .eq('id', data.user.id)
          .single();

        if (!userData?.verified) {
          setError('Veuillez vérifier votre email avant de vous connecter');
          await supabase.auth.signOut();
          return;
        }

        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Bienvenue</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {verificationStep ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Vérification de votre email</h2>
            <p className="text-gray-600 mb-6">
              Veuillez saisir le code à 6 chiffres envoyé à {email}
            </p>
            <VerificationCode onComplete={handleVerificationComplete} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {isSignUp && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="visitor">Visiteur</option>
                <option value="professional">Professionnel</option>
                <option value="admin">Administrateur</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                {selectedRole === 'visitor' && "Accédez aux plans et sauvegardez vos favoris"}
                {selectedRole === 'professional' && "Publiez et gérez vos plans de maison"}
                {selectedRole === 'admin' && "Gérez l'ensemble de la plateforme"}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <PasswordValidation
              password={password}
              onChange={setPassword}
              isSignUp={isSignUp}
            />
          </div>

          <button
            onClick={isSignUp ? handleSignUp : handleSignIn}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </button>

          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setPassword('');
              setError('');
              setMessage('');
              setVerificationStep(false);
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
          </button>
        </div>
      )}
    </div>
  );
}