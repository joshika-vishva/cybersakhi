import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, CheckCircle, MessageCircle } from 'lucide-react';

const stats = [
  { icon: Users, value: "10,000+", label: "Women Protected", color: "text-pink-500" },
  { icon: CheckCircle, value: "95%", label: "Cases Resolved", color: "text-emerald-500" },
  { icon: MessageCircle, value: "24/7", label: "AI Support", color: "text-violet-500" },
  { icon: Shield, value: "100%", label: "Confidential", color: "text-blue-500" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}