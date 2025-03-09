import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
  onChange: (password: string) => void;
  isSignUp?: boolean;
}

export default function PasswordValidation({ password, onChange, isSignUp = false }: PasswordValidationProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(isSignUp);

  const generateSecurePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.?';
    
    let generated = '';
    // Ensure at least one of each required character type
    generated += uppercase[Math.floor(Math.random() * uppercase.length)];
    generated += lowercase[Math.floor(Math.random() * lowercase.length)];
    generated += numbers[Math.floor(Math.random() * numbers.length)];
    generated += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = generated.length; i < length; i++) {
      generated += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return generated.split('').sort(() => Math.random() - 0.5).join('');
  };

  const validatePassword = (pass: string) => {
    const hasMinLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*()_+-=[\]{}|;:,.?]/.test(pass);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  useEffect(() => {
    // Generate a secure password only on component mount during sign up
    if (isSignUp && !password) {
      onChange(generateSecurePassword());
    }
  }, []);

  useEffect(() => {
    // Show tooltip only during sign up and when password is invalid
    setShowTooltip(isSignUp && !validatePassword(password));
  }, [password, isSignUp]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2 pr-10 border rounded-lg ${
              showTooltip ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {isSignUp && (
          <button
            onClick={() => {
              const newPassword = generateSecurePassword();
              onChange(newPassword);
              setShowPassword(true);
            }}
            type="button"
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Générer
          </button>
        )}
      </div>
      
      {showTooltip && (
        <div className="absolute mt-2 p-2 bg-red-100 text-red-700 text-sm rounded-lg">
          Le mot de passe doit contenir au moins :
          <ul className="list-disc list-inside mt-1">
            <li>8 caractères</li>
            <li>Une lettre majuscule</li>
            <li>Une lettre minuscule</li>
            <li>Un chiffre</li>
            <li>Un caractère spécial (!@#$%^&*()_+-=[]{}|;:,.?)</li>
          </ul>
        </div>
      )}
    </div>
  );
}