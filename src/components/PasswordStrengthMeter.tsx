import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score; // 0-4

  const getColor = () => {
    switch (score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-lime-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getWidth = () => {
    return `${(score + 1) * 20}%`;
  };

  const isValid = () => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  if (isValid()) return null;

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: getWidth() }}
        />
      </div>
      <p className="text-xs mt-1 text-gray-500">
        Le mot de passe doit contenir au moins 8 caractères, des majuscules, des minuscules, des chiffres et un caractère spécial
      </p>
    </div>
  );
}