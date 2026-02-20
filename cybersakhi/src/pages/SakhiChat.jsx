import React from 'react';
import SakhiChatInterface from '@/components/chat/SakhiChatInterface';
import { Shield, Info } from 'lucide-react';

export default function SakhiChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
            <Shield className="w-4 h-4 text-violet-600" />
            <span className="text-violet-700 text-sm font-medium">AI-Powered Safety Assistant</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Chat with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">Sakhi</span>
          </h1>
          <p className="text-slate-600">Your trusted companion for digital safety questions and guidance</p>
        </div>

        <SakhiChatInterface />

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Sakhi provides general guidance on cyber safety. For emergencies or immediate threats, 
              please contact local authorities or use our <strong>Emergency SOS</strong> feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}