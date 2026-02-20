import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Shield, MessageCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        
        {/* Floating orbs */}
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Shield className="w-4 h-4 text-pink-400" />
            <span className="text-white/90 text-sm font-medium">Your Digital Safety Companion</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Cyber<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Sakhi</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Empowering women with AI-powered digital safety. Report, learn, and stay protected in the online world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to={createPageUrl("SakhiChat")}>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-pink-500/25 transition-all hover:shadow-xl hover:shadow-pink-500/30">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Sakhi AI
              </Button>
            </Link>
            <Link to={createPageUrl("ReportCrime")}>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report Incident
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: MessageCircle, title: "AI Safety Assistant", desc: "Get instant help from Sakhi in English, Tamil & more", color: "from-pink-500 to-rose-500" },
            { icon: Shield, title: "Report & Track", desc: "File complaints and track resolution securely", color: "from-violet-500 to-purple-500" },
            { icon: BookOpen, title: "Learn & Protect", desc: "Cyber hygiene tips and safety awareness guides", color: "from-fuchsia-500 to-pink-500" }
          ].map((feature, i) => (
            <div key={i} className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}