import React, { useState, useRef, useEffect } from 'react';

interface VerificationCodeProps {
  onComplete: (code: string) => void;
}

export default function VerificationCode({ onComplete }: VerificationCodeProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Check if code is complete
    if (newCode.every(digit => digit) && newCode.join('').length === 6) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) newCode[index] = digit;
    });
    setCode(newCode);

    // Focus last filled input or first empty one
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-2">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={el => inputs.current[index] = el}
          type="text"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}