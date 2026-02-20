import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  LayoutDashboard, FileText, Clock, CheckCircle, AlertTriangle,
  Eye, Users, TrendingUp, ChevronRight, Shield, Loader2,
  Calendar, ExternalLink, X
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-700' },
};

const categoryLabels = {
  harassment: 'Harassment',
  phishing: 'Phishing',
  identity_theft: 'Identity Theft',
  cyberstalking: 'Cyberstalking',
  morphed_images: 'Morphed Images',
  blackmail: 'Blackmail',
  hacking: 'Hacking',
  other: 'Other'
};

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#6366f1', '#84cc16'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['allComplaints'],
    queryFn: () => base44.entities.Complaint.list('-created_date')
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const updateComplaintMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Complaint.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComplaints'] });
      toast.success('Complaint updated');
    }
  });

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    escalated: complaints.filter(c => c.status === 'escalated').length,
    users: users.length
  };

  // Charts data
  const categoryData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: categoryLabels[name] || name, value }));

  const statusData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: statusConfig[name]?.label || name, value }));

  const filteredComplaints = statusFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
            <p className="text-slate-600">Manage complaints and monitor analytics</p>
          </div>
          <Badge className="bg-violet-100 text-violet-700">
            <Shield className="w-4 h-4 mr-1" />
            Admin Panel
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-sm mb-8">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="complaints">
              <FileText className="w-4 h-4 mr-2" />
              Complaints
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Cases', value: stats.total, icon: FileText, color: 'from-violet-500 to-purple-600' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-600' },
                { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
                { label: 'Escalated', value: stats.escalated, icon: AlertTriangle, color: 'from-red-500 to-rose-600' },
                { label: 'Users', value: stats.users, icon: Users, color: 'from-blue-500 to-indigo-600' },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Complaints by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent High Priority */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  High Priority Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {complaints.filter(c => c.priority === 'high' || c.priority === 'critical').slice(0, 5).length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No high priority cases</p>
                ) : (
                  <div className="space-y-3">
                    {complaints.filter(c => c.priority === 'high' || c.priority === 'critical').slice(0, 5).map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-800">{complaint.title}</h4>
                          <p className="text-sm text-slate-500">{categoryLabels[complaint.category]}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">{complaint.priority}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Complaints</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredComplaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{complaint.title}</h3>
                              <Badge className={statusConfig[complaint.status]?.color}>
                                {statusConfig[complaint.status]?.label}
                              </Badge>
                              {(complaint.priority === 'high' || complaint.priority === 'critical') && (
                                <Badge className="bg-red-100 text-red-700">{complaint.priority}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-1 mb-2">{complaint.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{format(new Date(complaint.created_date), 'MMM d, yyyy')}</span>
                              <span>{categoryLabels[complaint.category]}</span>
                              <span>{complaint.created_by}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </div>
                    <p className="text-slate-500">Cases Resolved</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-violet-600 mb-2">24h</div>
                    <p className="text-slate-500">Average First Response</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedComplaint(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Complaint Details</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedComplaint(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{selectedComplaint.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={statusConfig[selectedComplaint.status]?.color}>
                        {statusConfig[selectedComplaint.status]?.label}
                      </Badge>
                      <Badge variant="outline">{categoryLabels[selectedComplaint.category]}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">Description</p>
                    <p className="text-slate-700">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Submitted By</p>
                      <p className="text-slate-700">{selectedComplaint.created_by}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Date</p>
                      <p className="text-slate-700">{format(new Date(selectedComplaint.created_date), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Platform</p>
                      <p className="text-slate-700">{selectedComplaint.platform || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Priority</p>
                      <p className="text-slate-700 capitalize">{selectedComplaint.priority}</p>
                    </div>
                  </div>

                  {selectedComplaint.evidence_urls?.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Evidence Files</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedComplaint.evidence_urls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              File {i + 1}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <p className="text-sm text-slate-500 mb-2">Update Status</p>
                    <div className="flex gap-3">
                      <Select 
                        value={selectedComplaint.status}
                        onValueChange={(value) => {
                          updateComplaintMutation.mutate({
                            id: selectedComplaint.id,
                            data: { status: value }
                          });
                          setSelectedComplaint({ ...selectedComplaint, status: value });
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="escalated">Escalated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}