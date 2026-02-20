import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ComplaintForm from '@/components/report/ComplaintForm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportCrime() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Complaint Submitted</h2>
              <p className="text-slate-600 mb-6">
                Your complaint has been received and will be reviewed by our team. You can track its status in your dashboard.
              </p>
              <div className="space-y-3">
                <Link to={createPageUrl("UserDashboard")}>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                  Submit Another Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
            <FileWarning className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-medium">Report Cyber Crime</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            File a Complaint
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Your safety matters. Report any cyber crime incident and we'll help you through the process.
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Secure & Confidential</h3>
                <p className="text-sm text-slate-500">Your information is encrypted and protected</p>
              </div>
            </div>
            
            <ComplaintForm onSuccess={() => setSubmitted(true)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}