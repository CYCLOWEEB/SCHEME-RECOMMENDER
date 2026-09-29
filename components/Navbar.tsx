'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Calculator, 
  Sparkles, 
  FileCheck, 
  PhoneCall, 
  Languages, 
  Layers, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'wizard' | 'calculator' | 'locator' | 'assistant' | 'documents';
  setActiveTab: (tab: 'wizard' | 'calculator' | 'locator' | 'assistant' | 'documents') => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  language,
  setLanguage
}: NavbarProps) {
  const languagesList = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Tiranga Tricolor Line & National Portal Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 border-b border-slate-200" />
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Scheme for your benefit
            </span>
            <span className="text-slate-500">|</span>
            <span>Ministry of Social Justice & Empowerment</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Channel Finance System (NSFDC / NSKFDC / SCAs / PSBs)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:14566" 
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors font-medium"
              title="Toll-Free SC/ST Beneficiary Grievance & Information Portal"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Toll Free: 14566</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Smart Scheme Recommender"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-sky-400/30 border border-sky-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Smart <span className="text-sky-600">Scheme Recommender</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                    Direct Portal
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Scheme for your benefit • Direct Concessional Credit & Channel Partner Routing
              </p>
            </div>
          </div>

          {/* Right Controls (Language & Direct CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium transition-colors border border-slate-200">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
              >
                {languagesList.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Anti-Fraud Badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-sky-900 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Zero Middlemen • 100% Direct Channel</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="mt-3 flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-2">
          <button
            id="tab-wizard"
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'wizard'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Smart Scheme Recommender</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'calculator'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Financial & EMI Calculator</span>
          </button>

          <button
            id="tab-locator"
            onClick={() => setActiveTab('locator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'locator'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Partner Locator & NPA Router</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-300">
              Live
            </span>
          </button>

          <button
            id="tab-assistant"
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assistant'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>AI Seva Vaani (Voice & Chat)</span>
          </button>

          <button
            id="tab-documents"
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'documents'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Document Readiness Locker</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
