import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import AIEngineSection from '@/components/landing/AIEngineSection';
import DangerDetectionSection from '@/components/landing/DangerDetectionSection';
import SafetyPackSection from '@/components/landing/SafetyPackSection';
import UserModesSection from '@/components/landing/UserModesSection';
import ChemicalGuardianSection from '@/components/landing/ChemicalGuardianSection';
import PrivacyHighlightSection from '@/components/landing/PrivacyHighlightSection';
import PricingSection from '@/components/landing/PricingSection';
import SecuritySection from '@/components/landing/SecuritySection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import LiveRatings from '@/components/landing/LiveRatings';
import TrustBadges from '@/components/landing/TrustBadges';
import LiveStats from '@/components/landing/LiveStats';
import Footer from '@/components/landing/Footer';
import ScrollToTopButton from '@/components/landing/ScrollToTopButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LiveStats />
      <TrustBadges />
      <FeaturesGrid />
      <AIEngineSection />
      <DangerDetectionSection />
      <SafetyPackSection />
      <UserModesSection />
      <ChemicalGuardianSection />
      <TestimonialsSection />
      <LiveRatings />
      <PrivacyHighlightSection />
      <SecuritySection />
      <PricingSection />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}