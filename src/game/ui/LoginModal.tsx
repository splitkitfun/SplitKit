'use client';

import React, { useState } from 'react';

interface LoginModalProps {
  currentUsername: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentUsername,
  onLogin,
  onLogout,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    
    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (trimmed.length > 16) {
      setError('Username must be 16 characters or less');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Only letters, numbers, and underscores allowed');
      return;
    }
    
    onLogin(trimmed);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0f]/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#151510] border-2 border-[#2a2a20] rounded-lg p-6 w-80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          className="text-[#c9aa71] text-center mb-6"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
        >
          {currentUsername ? 'PROFILE' : 'SIGN IN'}
        </h2>

        {currentUsername ? (
          // Logged in view
          <div className="space-y-4">
            <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-4 text-center">
              <div className="text-4xl mb-2">👤</div>
              <div 
                className="text-[#c9aa71]"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
              >
                {currentUsername}
              </div>
              <div className="text-[#6a6a5a] text-xs mt-1" style={{ fontFamily: 'monospace' }}>
                Saves are stored locally
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-3 bg-[#3a2a2a] hover:bg-[#4a3a3a] border border-[#5a4a4a] rounded text-[#aa8a8a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
            >
              SWITCH ACCOUNT
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#4a4a4a] rounded text-[#8a8a8a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
            >
              CLOSE
            </button>
          </div>
        ) : (
          // Login form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                className="block text-[#8a8a7a] text-xs mb-2"
                style={{ fontFamily: 'monospace' }}
              >
                Choose a username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter username..."
                className="w-full bg-[#1a1a15] border border-[#2a2a20] rounded px-3 py-3 text-[#c9aa71] placeholder-[#4a4a3a] focus:outline-none focus:border-[#4a4a3a]"
                style={{ fontFamily: 'monospace' }}
                autoFocus
              />
              {error && (
                <p className="text-[#aa6666] text-xs mt-1" style={{ fontFamily: 'monospace' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2a3a2a] hover:bg-[#3a4a3a] border border-[#4a5a4a] rounded text-[#8aaa8a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
            >
              SIGN IN
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[#6a6a5a] hover:text-[#8a8a7a] text-xs transition-colors"
                style={{ fontFamily: 'monospace' }}
              >
                Continue as Guest
              </button>
            </div>

            <p className="text-[#4a4a3a] text-[10px] text-center" style={{ fontFamily: 'monospace' }}>
              Your save data is stored locally in your browser. Different usernames have separate saves.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};


