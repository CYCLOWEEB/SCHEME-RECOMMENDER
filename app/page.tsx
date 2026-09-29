'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import SchemeWizard from '@/components/SchemeWizard';
import FinancialCalculator from '@/components/FinancialCalculator';
import PartnerLocatorMap from '@/components/PartnerLocatorMap';
import VoiceAIAssistant from '@/components/VoiceAIAssistant';
import DocumentLocker from '@/components/DocumentLocker';
import { UserProfile, SchemeMatchResult } from '@/lib/types';
import { 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink,
  Layers,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'wizard' | 'calculator' | 'locator' | 'assistant' | 'documents'>('wizard');
  const [language, setLanguage] = useState<string>('en');

  // Beneficiary Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ramesh Kumar',
    age: 32,
    gender: 'male',
    category: 'SC',
    annualFamilyIncome: 180000,
    state: 'Delhi',
    district: 'Central Delhi',
    projectType: 'micro_business',
    estimatedCost: 150000,
    ownContribution: 15000,
    educationStatus: '10th_pass',
    isPriorBeneficiary: false,
    hasCasteCertificate: true,
    hasIncomeCertificate: true,
    hasDPR: false
  });

  // Cross-component coordination
  const [selectedSchemeIdForCalc, setSelectedSchemeIdForCalc] = useState<string>('nsfdc-tls');
  const [selectedSchemeIdForLocator, setSelectedSchemeIdForLocator] = useState<string>('all');
  const [currentAiSchemeName, setCurrentAiSchemeName] = useState<string>('');

  const handleSelectForCalculator = (result: SchemeMatchResult) => {
    setSelectedSchemeIdForCalc(result.scheme.id);
    setActiveTab('calculator');
  };

  const handleSelectForLocator = (schemeId: string) => {
    setSelectedSchemeIdForLocator(schemeId);
    setActiveTab('locator');
  };

  const handleAskAi = (schemeName: string) => {
    setCurrentAiSchemeName(schemeName);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar with Sticky Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'wizard' && (
          <SchemeWizard
            onSelectForCalculator={handleSelectForCalculator}
            onSelectForLocator={handleSelectForLocator}
            onAskAi={handleAskAi}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}

        {activeTab === 'calculator' && (
          <FinancialCalculator
            preselectedSchemeId={selectedSchemeIdForCalc}
            onSelectLocator={handleSelectForLocator}
          />
        )}

        {activeTab === 'locator' && (
          <PartnerLocatorMap
            initialSchemeId={selectedSchemeIdForLocator}
            userState={userProfile.state}
          />
        )}

        {activeTab === 'assistant' && (
          <VoiceAIAssistant
            language={language}
            setLanguage={setLanguage}
            currentSchemeName={currentAiSchemeName}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentLocker
            userProfile={userProfile}
            selectedSchemeName="NSFDC Term Loan / Mahila Samriddhi"
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <Image 
                src="/icon.png" 
                alt="Smart Scheme Recommender" 
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-sky-400/40" 
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-white font-bold text-sm">
                  Smart Scheme Recommender
                </h4>
                <p className="text-[11px] text-slate-400">
                  Scheme for your benefit • Direct Concessional Credit & Channel Partner Routing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://nsfdc.nic.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 text-slate-300 flex items-center gap-1 transition-colors"
              >
                <span>NSFDC Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://socialjustice.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 text-slate-300 flex items-center gap-1 transition-colors"
              >
                <span>Ministry of Social Justice & Empowerment</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Designed for National Scheduled Castes Finance & Development Corporation (NSFDC) & State Channelizing Agencies (SCAs).
            </p>
            <p>
              Channel Finance System • Zero Middlemen • 100% Free Concessional Credit Routing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
