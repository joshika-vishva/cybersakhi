import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageCircle, 
  FileWarning, 
  GraduationCap, 
  KeyRound, 
  Search,
  Phone,
  LayoutDashboard
} from 'lucide-react';

const actions = [
  { icon: MessageCircle, label: "Chat with Sakhi", page: "SakhiChat", color: "bg-gradient-to-br from-pink-500 to-rose-600", desc: "AI Safety Assistant" },
  { icon: FileWarning, label: "Report Crime", page: "ReportCrime", color: "bg-gradient-to-br from-red-500 to-orange-600", desc: "File a Complaint" },
  { icon: LayoutDashboard, label: "My Dashboard", page: "UserDashboard", color: "bg-gradient-to-br from-violet-500 to-purple-600", desc: "Track Your Cases" },
  { icon: GraduationCap, label: "Learning Center", page: "LearningCenter", color: "bg-gradient-to-br from-emerald-500 to-teal-600", desc: "Safety Guides" },
  { icon: KeyRound, label: "Password Check", page: "SecurityTools", color: "bg-gradient-to-br from-amber-500 to-yellow-600", desc: "Test Password Strength" },
  { icon: Search, label: "Harassment Check", page: "SecurityTools", color: "bg-gradient-to-br from-blue-500 to-indigo-600", desc: "Detect Threats" },
  { icon: Phone, label: "Emergency SOS", page: "EmergencySOS", color: "bg-gradient-to-br from-rose-600 to-red-700", desc: "Quick Report" },
  { icon: Shield, label: "Safety Tips", page: "LearningCenter", color: "bg-gradient-to-br from-cyan-500 to-blue-600", desc: "Stay Protected" },
];

export default function QuickActions() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Quick Access
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Everything you need for your digital safety, one click away
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={createPageUrl(action.page)}>
                <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 cursor-pointer">
                  <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{action.label}</h3>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}