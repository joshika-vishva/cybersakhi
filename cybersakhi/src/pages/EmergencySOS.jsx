import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, Phone, Plus, Trash2, Shield, 
  Upload, Loader2, CheckCircle, User, FileWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function EmergencySOS() {
  const [showQuickReport, setShowQuickReport] = useState(false);
  const [quickDescription, setQuickDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', relationship: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: () => base44.entities.EmergencyContact.list()
  });

  const addContactMutation = useMutation({
    mutationFn: (data) => base44.entities.EmergencyContact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      setNewContact({ name: '', phone: '', email: '', relationship: '' });
      setShowAddContact(false);
      toast.success('Contact added successfully');
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id) => base44.entities.EmergencyContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      toast.success('Contact removed');
    }
  });

  const handleQuickReport = async () => {
    if (!quickDescription.trim()) {
      toast.error('Please describe the situation');
      return;
    }

    setIsSubmitting(true);
    await base44.entities.Complaint.create({
      title: 'EMERGENCY SOS Report',
      category: 'other',
      description: quickDescription,
      status: 'pending',
      priority: 'critical'
    });
    
    toast.success('Emergency report submitted');
    setQuickDescription('');
    setShowQuickReport(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-medium">Emergency Mode</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Emergency SOS
          </h1>
          <p className="text-slate-600">
            Quick access to emergency features and trusted contacts
          </p>
        </div>

        {/* Quick Report Button */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-600 to-rose-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Quick Emergency Report</h2>
                  <p className="text-white/80">
                    In immediate danger? File a quick report with critical priority
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => setShowQuickReport(!showQuickReport)}
                  className="bg-white text-red-600 hover:bg-white/90 px-8 py-6 text-lg"
                >
                  <FileWarning className="w-5 h-5 mr-2" />
                  SOS Report
                </Button>
              </div>

              <AnimatePresence>
                {showQuickReport && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/20"
                  >
                    <Textarea
                      placeholder="Briefly describe your situation..."
                      value={quickDescription}
                      onChange={(e) => setQuickDescription(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mb-4 min-h-[100px]"
                    />
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleQuickReport}
                        disabled={isSubmitting}
                        className="bg-white text-red-600 hover:bg-white/90"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Submit Emergency Report
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowQuickReport(false)}
                        className="border-white/30 text-white hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Numbers */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-violet-600" />
              Important Helpline Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Women Helpline', number: '181', desc: '24/7 support' },
                { name: 'Cyber Crime', number: '1930', desc: 'National cyber crime helpline' },
                { name: 'Police Emergency', number: '100', desc: 'Immediate police assistance' },
                { name: 'NCW Helpline', number: '7827-170-170', desc: 'National Commission for Women' },
              ].map((helpline, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-800">{helpline.name}</h4>
                    <p className="text-sm text-slate-500">{helpline.desc}</p>
                  </div>
                  <a href={`tel:${helpline.number}`}>
                    <Button variant="outline" className="border-violet-200 text-violet-600 hover:bg-violet-50">
                      <Phone className="w-4 h-4 mr-2" />
                      {helpline.number}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" />
              My Emergency Contacts
            </CardTitle>
            <Button onClick={() => setShowAddContact(!showAddContact)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {showAddContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-slate-50 rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Name</Label>
                      <Input 
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input 
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input 
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                        placeholder="e.g., Sister, Friend"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => addContactMutation.mutate(newContact)}
                      disabled={!newContact.name}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Save Contact
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddContact(false)}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No emergency contacts added yet</p>
                <Button onClick={() => setShowAddContact(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{contact.name}</h4>
                        <p className="text-sm text-slate-500">
                          {contact.relationship && `${contact.relationship} • `}
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`}>
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => deleteContactMutation.mutate(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}