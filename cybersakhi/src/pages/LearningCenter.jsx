import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Clock, Shield, Lock, Mail, Users, 
  ChevronRight, Search, GraduationCap, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const defaultContent = [
  {
    id: 1,
    title: "Password Security Basics",
    category: "password_safety",
    content: `## Why Strong Passwords Matter

A strong password is your first line of defense against hackers. Here's what you need to know:

### Creating a Strong Password
- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and symbols
- Avoid personal information like birthdays or names
- Use unique passwords for each account

### Password Managers
Consider using a password manager to:
- Generate strong passwords automatically
- Store passwords securely
- Auto-fill login forms safely

### What to Avoid
- Common words like "password" or "123456"
- Personal information
- Patterns like "qwerty" or "abc123"`,
    read_time: 3,
    difficulty: "beginner"
  },
  {
    id: 2,
    title: "Recognizing Phishing Attacks",
    category: "phishing",
    content: `## How to Spot Phishing Attempts

Phishing is when attackers try to trick you into giving up personal information.

### Warning Signs
- Urgent messages demanding immediate action
- Suspicious sender email addresses
- Generic greetings like "Dear Customer"
- Spelling and grammar mistakes
- Requests for personal information

### What to Do
1. Don't click suspicious links
2. Verify the sender independently
3. Check the URL before entering any information
4. Report phishing attempts to the platform`,
    read_time: 4,
    difficulty: "beginner"
  },
  {
    id: 3,
    title: "Social Media Privacy Settings",
    category: "social_media",
    content: `## Protecting Your Privacy on Social Media

### Key Settings to Review
- Profile visibility (public vs private)
- Location sharing
- Tag review and approval
- Third-party app access

### Best Practices
- Limit personal information shared publicly
- Review friend/follower requests carefully
- Be cautious about sharing your location
- Regularly audit your privacy settings`,
    read_time: 5,
    difficulty: "beginner"
  },
  {
    id: 4,
    title: "Handling Online Harassment",
    category: "harassment",
    content: `## Dealing with Online Harassment

If you're being harassed online, here's what you can do:

### Immediate Steps
1. **Document Everything** - Take screenshots with timestamps
2. **Don't Engage** - Avoid responding to harassers
3. **Block the Harasser** - Use platform blocking features
4. **Report to Platform** - Use official reporting tools

### Legal Options
- File a police complaint with evidence
- Contact cyber crime cells
- Seek legal advice if needed

### Get Support
- Reach out to trusted friends/family
- Contact support organizations
- Use CyberSakhi for guidance`,
    read_time: 6,
    difficulty: "intermediate"
  }
];

const categoryConfig = {
  password_safety: { icon: Lock, color: 'from-amber-500 to-yellow-600', label: 'Password Safety' },
  phishing: { icon: Mail, color: 'from-red-500 to-rose-600', label: 'Phishing' },
  social_media: { icon: Users, color: 'from-blue-500 to-indigo-600', label: 'Social Media' },
  harassment: { icon: Shield, color: 'from-purple-500 to-violet-600', label: 'Harassment' },
  privacy: { icon: Lock, color: 'from-emerald-500 to-teal-600', label: 'Privacy' },
  general: { icon: BookOpen, color: 'from-slate-500 to-slate-700', label: 'General' }
};

export default function LearningCenter() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { data: content = defaultContent, isLoading } = useQuery({
    queryKey: ['learningContent'],
    queryFn: async () => {
      const data = await base44.entities.LearningContent.list();
      return data.length > 0 ? data : defaultContent;
    },
    initialData: defaultContent
  });

  const filteredContent = activeCategory === 'all' 
    ? content 
    : content.filter(c => c.category === activeCategory);

  if (selectedArticle) {
    const cat = categoryConfig[selectedArticle.category] || categoryConfig.general;
    const Icon = cat.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            ← Back to Learning Center
          </Button>
          
          <Card className="border-0 shadow-xl">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline">{cat.label}</Badge>
              </div>
              <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedArticle.read_time} min read
                </span>
                <Badge variant="secondary" className="capitalize">{selectedArticle.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <ReactMarkdown className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600">
                {selectedArticle.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">Learning Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Cyber Safety Guides
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Learn how to protect yourself online with our comprehensive guides
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-white shadow-sm p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="rounded-lg">All Topics</TabsTrigger>
            <TabsTrigger value="password_safety" className="rounded-lg">Passwords</TabsTrigger>
            <TabsTrigger value="phishing" className="rounded-lg">Phishing</TabsTrigger>
            <TabsTrigger value="social_media" className="rounded-lg">Social Media</TabsTrigger>
            <TabsTrigger value="harassment" className="rounded-lg">Harassment</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContent.map((article, i) => {
              const cat = categoryConfig[article.category] || categoryConfig.general;
              const Icon = cat.icon;
              
              return (
                <motion.div
                  key={article.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card 
                    className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-violet-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="text-xs">{cat.label}</Badge>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time} min
                        </span>
                        <Badge variant="secondary" className="text-xs capitalize">{article.difficulty}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}