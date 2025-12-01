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
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesGrid />
      <AIEngineSection />
      <DangerDetectionSection />
      <SafetyPackSection />
      <UserModesSection />
      <ChemicalGuardianSection />
      <PrivacyHighlightSection />
      <SecuritySection />
      <PricingSection />
      <Footer />
    </div>
  );
}