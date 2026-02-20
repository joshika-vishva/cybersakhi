import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const systemPrompts = {
  english: `You are Sakhi, a compassionate and knowledgeable AI safety companion designed to help women navigate digital safety challenges. You provide:
- Clear, actionable advice on cyber safety
- Emotional support with a professional, caring tone
- Information about reporting cyber crimes
- Tips on password security, privacy protection, and recognizing threats
- Guidance on handling online harassment, phishing, and identity theft

Always be supportive, never judgmental. If someone is in immediate danger, recommend contacting emergency services. Keep responses concise but thorough.`,
  
  tamil: `நீங்கள் சகி, பெண்களுக்கு டிஜிட்டல் பாதுகாப்பு சவால்களை சமாளிக்க உதவும் ஒரு அன்பான மற்றும் அறிவுள்ள AI பாதுகாப்பு துணையாக இருக்கிறீர்கள். நீங்கள் வழங்குவது:
- சைபர் பாதுகாப்பு பற்றிய தெளிவான, செயல்படக்கூடிய ஆலோசனை
- தொழில்முறை, அக்கறையான தொனியுடன் உணர்ச்சிபூர்வமான ஆதரவு
- சைபர் குற்றங்களை புகாரளிப்பது பற்றிய தகவல்
- கடவுச்சொல் பாதுகாப்பு, தனியுரிமை பாதுகாப்பு மற்றும் அச்சுறுத்தல்களை அங்கீகரிப்பதற்கான உதவிக்குறிப்புகள்

எப்போதும் ஆதரவாக இருங்கள், தீர்ப்பு வழங்காதீர்கள். தமிழில் பதிலளிக்கவும்.`,

  tanglish: `You are Sakhi, a friendly AI safety companion. Respond in Tanglish (Tamil written in English letters mixed with English). Be supportive and helpful with cyber safety advice. Example: "Hi! Naan Sakhi, unga digital safety companion. Enna help venum?"`
};

export default function SakhiChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Sakhi, your digital safety companion. 🛡️ How can I help you stay safe online today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompts[language]}

Previous conversation:
${conversationHistory}

User: ${input}

Respond as Sakhi:`,
      add_context_from_internet: true
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-gradient-to-b from-violet-50 to-white rounded-2xl border border-violet-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Sakhi AI</h2>
            <p className="text-white/70 text-sm">Your Safety Companion</p>
          </div>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-36 bg-white/20 border-white/30 text-white">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tamil">தமிழ்</SelectItem>
            <SelectItem value="tanglish">Tanglish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' 
                  : 'bg-white border border-violet-100 shadow-sm'
              }`}>
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm prose-violet max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-violet-100 rounded-2xl p-4 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-violet-100">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border-violet-200 focus:border-violet-400 rounded-xl"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}