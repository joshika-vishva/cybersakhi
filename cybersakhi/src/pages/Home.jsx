import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickActions from '@/components/home/QuickActions';
import StatsSection from '@/components/home/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <QuickActions />
    </div>
  );
}