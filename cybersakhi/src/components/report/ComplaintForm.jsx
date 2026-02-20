import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, Image, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const categories = [
  { value: 'harassment', label: 'Online Harassment', icon: '😠' },
  { value: 'phishing', label: 'Phishing/Scam', icon: '🎣' },
  { value: 'identity_theft', label: 'Identity Theft', icon: '🎭' },
  { value: 'cyberstalking', label: 'Cyberstalking', icon: '👁️' },
  { value: 'morphed_images', label: 'Morphed Images/Deepfakes', icon: '📸' },
  { value: 'blackmail', label: 'Blackmail/Extortion', icon: '💰' },
  { value: 'hacking', label: 'Account Hacking', icon: '💻' },
  { value: 'other', label: 'Other', icon: '📝' },
];

const platforms = [
  'Facebook', 'Instagram', 'WhatsApp', 'Twitter/X', 'Telegram', 
  'Snapchat', 'LinkedIn', 'Email', 'Dating App', 'Other'
];

export default function ComplaintForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    platform: '',
    incident_date: '',
    evidence_urls: []
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadingFiles(true);
    
    const uploadedUrls = [];
    for (const file of selectedFiles) {
      const result = await base44.integrations.Core.UploadFile({ file });
      uploadedUrls.push(result.file_url);
      setFiles(prev => [...prev, { name: file.name, url: result.file_url, type: file.type }]);
    }
    
    setFormData(prev => ({
      ...prev,
      evidence_urls: [...prev.evidence_urls, ...uploadedUrls]
    }));
    setUploadingFiles(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      evidence_urls: prev.evidence_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    await base44.entities.Complaint.create({
      ...formData,
      status: 'pending',
      priority: formData.category === 'blackmail' || formData.category === 'morphed_images' ? 'high' : 'medium'
    });
    
    toast.success('Complaint submitted successfully');
    onSuccess?.();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Incident Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the incident"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Where did it happen?" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incident_date">Incident Date</Label>
          <Input
            id="incident_date"
            type="date"
            value={formData.incident_date}
            onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          placeholder="Please describe what happened in detail. Include any relevant information like usernames, links, or timeline of events."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="min-h-[150px] border-slate-200"
        />
      </div>

      {/* Evidence Upload */}
      <div className="space-y-3">
        <Label>Evidence (Screenshots, Documents)</Label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-violet-300 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="evidence-upload"
          />
          <label htmlFor="evidence-upload" className="cursor-pointer">
            {uploadingFiles ? (
              <Loader2 className="w-10 h-10 mx-auto text-violet-500 animate-spin mb-2" />
            ) : (
              <Upload className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            )}
            <p className="text-slate-600 font-medium">Click to upload evidence</p>
            <p className="text-slate-400 text-sm">Screenshots, PDFs, documents supported</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-slate-50 rounded-lg p-3"
              >
                {file.type?.startsWith('image') ? (
                  <Image className="w-5 h-5 text-violet-500" />
                ) : (
                  <FileText className="w-5 h-5 text-violet-500" />
                )}
                <span className="flex-1 text-sm text-slate-700 truncate">{file.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-sm">
          Your complaint will be handled with complete confidentiality. All evidence is securely stored and only accessible to authorized personnel.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 py-6 text-lg rounded-xl"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <CheckCircle className="w-5 h-5 mr-2" />
        )}
        Submit Complaint
      </Button>
    </form>
  );
}