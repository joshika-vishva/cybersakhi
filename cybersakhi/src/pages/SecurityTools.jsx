import React from 'react';
import PasswordStrengthChecker from '@/components/security/PasswordStrengthChecker';
import HarassmentDetector from '@/components/security/HarassmentDetector';
import { Shield, Lock, Search } from 'lucide-react';

export default function SecurityTools() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
            <Shield className="w-4 h-4 text-violet-600" />
            <span className="text-violet-700 text-sm font-medium">Security Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Protect Yourself Online
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Use these tools to check your security and detect potential threats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PasswordStrengthChecker />
          <HarassmentDetector />
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            Quick Security Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Lock, title: "Use Unique Passwords", desc: "Never reuse passwords across different accounts" },
              { icon: Shield, title: "Enable 2FA", desc: "Add extra security with two-factor authentication" },
              { icon: Search, title: "Verify Links", desc: "Always check URLs before clicking or entering data" },
              { icon: Shield, title: "Update Regularly", desc: "Keep your apps and devices updated" },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{tip.title}</h4>
                  <p className="text-sm text-slate-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}