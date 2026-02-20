import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Clock, CheckCircle, AlertTriangle, Plus, 
  MessageCircle, Eye, Calendar, ChevronRight, Shield,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: Eye },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

const categoryLabels = {
  harassment: 'Online Harassment',
  phishing: 'Phishing/Scam',
  identity_theft: 'Identity Theft',
  cyberstalking: 'Cyberstalking',
  morphed_images: 'Morphed Images',
  blackmail: 'Blackmail',
  hacking: 'Account Hacking',
  other: 'Other'
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['userComplaints', user?.email],
    queryFn: () => base44.entities.Complaint.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const filteredComplaints = activeTab === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === activeTab);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    active: complaints.filter(c => ['under_review', 'escalated'].includes(c.status)).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">My Dashboard</h1>
            <p className="text-slate-600">Track and manage your complaints</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link to={createPageUrl("SakhiChat")}>
              <Button variant="outline" className="border-violet-200">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Sakhi
              </Button>
            </Link>
            <Link to={createPageUrl("ReportCrime")}>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Cases', value: stats.total, icon: FileText, color: 'from-violet-500 to-purple-600' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-600' },
            { label: 'Active', value: stats.active, icon: Eye, color: 'from-blue-500 to-indigo-600' },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Complaints List */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                My Complaints
              </CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="under_review">Review</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No complaints found</p>
                <Link to={createPageUrl("ReportCrime")}>
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4 mr-2" />
                    File a Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredComplaints.map((complaint, i) => {
                  const status = statusConfig[complaint.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  
                  return (
                    <motion.div
                      key={complaint.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-800">{complaint.title}</h3>
                            <Badge className={status.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(complaint.created_date), 'MMM d, yyyy')}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded">
                              {categoryLabels[complaint.category]}
                            </span>
                            {complaint.platform && (
                              <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded">
                                {complaint.platform}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}