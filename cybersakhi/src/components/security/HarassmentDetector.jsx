import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Search, Loader2, FileWarning, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HarassmentDetector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this message for potential harassment, threats, or abusive content. 
Be thorough but professional. Return a JSON object.

Message to analyze:
"${text}"

Analyze for:
1. Direct threats or intimidation
2. Sexual harassment
3. Bullying or demeaning language
4. Stalking behavior
5. Blackmail or extortion
6. Identity-based harassment`,
      response_json_schema: {
        type: "object",
        properties: {
          is_harmful: { type: "boolean" },
          severity: { type: "string", enum: ["none", "low", "medium", "high", "critical"] },
          categories_detected: { 
            type: "array", 
            items: { type: "string" }
          },
          explanation: { type: "string" },
          recommended_actions: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });
    
    setResult(response);
    setIsAnalyzing(false);
  };

  const severityConfig = {
    none: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
    low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Shield },
    medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
    critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: FileWarning },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Harassment Detection</h3>
            <p className="text-sm text-slate-500">AI-powered message analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Paste Message to Analyze</Label>
            <Textarea
              id="message"
              placeholder="Paste the suspicious message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] border-slate-200"
            />
          </div>

          <Button 
            onClick={analyzeText}
            disabled={isAnalyzing || !text.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            Analyze Message
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {(() => {
                  const config = severityConfig[result.severity] || severityConfig.none;
                  const Icon = config.icon;
                  
                  return (
                    <div className={`${config.bg} ${config.border} border rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${config.color}`} />
                        <span className={`font-semibold ${config.color} capitalize`}>
                          {result.severity === 'none' ? 'No threats detected' : `${result.severity} Risk Detected`}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm mb-4">{result.explanation}</p>
                      
                      {result.categories_detected?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-slate-500 mb-2">Categories Detected:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.categories_detected.map((cat, i) => (
                              <span key={i} className={`px-2 py-1 ${config.bg} ${config.color} text-xs rounded-full border ${config.border}`}>
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.recommended_actions?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-2">Recommended Actions:</p>
                          <ul className="space-y-1">
                            {result.recommended_actions.map((action, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-violet-500 mt-1">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {result.is_harmful && (
                  <Link to={createPageUrl("ReportCrime")}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700">
                      <FileWarning className="w-5 h-5 mr-2" />
                      Report This Incident
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}