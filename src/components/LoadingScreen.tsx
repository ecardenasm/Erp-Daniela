import React from 'react';
import { Citrus } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-yellow-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto">
          <Citrus 
            className="w-16 h-16 text-yellow-400 absolute top-0 left-0 animate-spin"
            style={{ 
              animation: 'spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              transformOrigin: 'center'
            }} 
          />
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
        </div>
        <p className="mt-4 text-yellow-700 font-medium animate-pulse">
          Preparando tu limonada...
        </p>
      </div>
    </div>
  );
}