import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Check, X, Shield, AlertTriangle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const criteria = [
  { id: 'length', label: 'At least 12 characters', test: (p) => p.length >= 12 },
  { id: 'uppercase', label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Contains number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { id: 'noCommon', label: 'Not a common password', test: (p) => !['password', '123456', 'qwerty', 'admin'].some(c => p.toLowerCase().includes(c)) },
];

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const newResults = criteria.map(c => ({
      ...c,
      passed: c.test(password)
    }));
    setResults(newResults);
  }, [password]);

  const passedCount = results.filter(r => r.passed).length;
  const strengthPercent = (passedCount / criteria.length) * 100;
  
  const getStrengthLabel = () => {
    if (passedCount === 0) return { label: 'Enter Password', color: 'text-slate-400' };
    if (passedCount <= 2) return { label: 'Weak', color: 'text-red-500' };
    if (passedCount <= 4) return { label: 'Medium', color: 'text-amber-500' };
    if (passedCount < 6) return { label: 'Strong', color: 'text-emerald-500' };
    return { label: 'Very Strong', color: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Password Strength Analyzer</h3>
            <p className="text-sm text-slate-500">Check if your password is secure</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Enter Password to Check</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Type your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {password && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Strength:</span>
                  <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                </div>
                <Progress 
                  value={strengthPercent} 
                  className="h-2"
                  style={{
                    '--progress-color': passedCount <= 2 ? '#ef4444' : passedCount <= 4 ? '#f59e0b' : '#10b981'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <AnimatePresence>
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        result.passed ? 'bg-emerald-50' : 'bg-slate-50'
                      }`}
                    >
                      {result.passed ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400" />
                      )}
                      <span className={`text-sm ${result.passed ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {result.label}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {passedCount < criteria.length && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    For better security, make sure your password meets all the criteria above.
                  </p>
                </div>
              )}

              {passedCount === criteria.length && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-800 text-sm">
                    Excellent! Your password meets all security criteria.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}