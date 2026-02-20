import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Menu, X, Home, MessageCircle, FileWarning, 
  LayoutDashboard, GraduationCap, AlertTriangle, Settings,
  LogOut, User, ChevronDown, ShieldCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: MessageCircle, label: 'Chat with Sakhi', page: 'SakhiChat' },
  { icon: FileWarning, label: 'Report Crime', page: 'ReportCrime' },
  { icon: LayoutDashboard, label: 'My Dashboard', page: 'UserDashboard' },
  { icon: GraduationCap, label: 'Learn', page: 'LearningCenter' },
  { icon: Settings, label: 'Security Tools', page: 'SecurityTools' },
  { icon: AlertTriangle, label: 'Emergency SOS', page: 'EmergencySOS' },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    }
  });

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  // Redirect to login if not authenticated (skip for Home page)
  useEffect(() => {
    if (!userLoading && !user && currentPageName !== 'Home') {
      base44.auth.redirectToLogin(window.location.href);
    }
  }, [user, userLoading, currentPageName]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHomePage = currentPageName === 'Home';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isHomePage ? 'bg-transparent' : 'bg-white/80 backdrop-blur-xl border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isHomePage ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-violet-600 to-purple-600'
              }`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className={`font-bold text-xl ${isHomePage ? 'text-white' : 'text-slate-800'}`}>
                Cyber<span className="text-violet-600">Sakhi</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <Link key={item.page} to={createPageUrl(item.page)}>
                  <Button 
                    variant="ghost" 
                    className={`${
                      currentPageName === item.page 
                        ? isHomePage ? 'bg-white/20 text-white' : 'bg-violet-50 text-violet-700'
                        : isHomePage ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {isAdmin && (
                <Link to={createPageUrl('AdminDashboard')}>
                  <Button 
                    variant="ghost"
                    className={isHomePage ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900'}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={isHomePage ? 'text-white' : 'text-slate-700'}>
                    <User className="w-4 h-4 mr-2" />
                    {user?.full_name?.split(' ')[0] || 'Account'}
                    {isAdmin && <Badge className="ml-2 bg-violet-100 text-violet-700 text-xs py-0 px-1.5">Admin</Badge>}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800">{user?.full_name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <div className="mt-1">
                      {isAdmin ? (
                        <Badge className="bg-violet-100 text-violet-700 text-xs">
                          <ShieldCheck className="w-3 h-3 mr-1" />Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 text-xs">
                          <User className="w-3 h-3 mr-1" />User
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('EmergencySOS')} className="flex items-center cursor-pointer">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                      Emergency SOS
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('SecurityTools')} className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Security Tools
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => base44.auth.logout()}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className={`md:hidden ${isHomePage ? 'text-white' : 'text-slate-700'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.page} to={createPageUrl(item.page)}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      currentPageName === item.page ? 'bg-violet-50 text-violet-700' : 'text-slate-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              {isAdmin && (
                <Link to={createPageUrl('AdminDashboard')}>
                  <Button variant="ghost" className="w-full justify-start text-slate-600">
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600"
                onClick={() => base44.auth.logout()}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className={isHomePage ? '' : 'pt-16'}>
        {children}
      </main>

      {/* Footer */}
      {!isHomePage && (
        <footer className="bg-white border-t border-slate-100 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-violet-600" />
              <span className="font-semibold text-slate-800">CyberSakhi</span>
            </div>
            <p className="text-slate-500 text-sm">
              Empowering women with digital safety tools and support.
            </p>
            <p className="text-slate-400 text-xs mt-2">
              © 2024 CyberSakhi. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}