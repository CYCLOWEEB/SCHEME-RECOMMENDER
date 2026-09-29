'use client';

import React, { useState, useMemo } from 'react';
import { UserProfile, BeneficiaryCategory, ProjectType, SchemeMatchResult } from '@/lib/types';
import { matchSchemes } from '@/lib/rule-engine';
import SchemeCard from './SchemeCard';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  Briefcase,
  IndianRupee,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface SchemeWizardProps {
  onSelectForCalculator: (result: SchemeMatchResult) => void;
  onSelectForLocator: (schemeId: string) => void;
  onAskAi: (schemeName: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function SchemeWizard({
  onSelectForCalculator,
  onSelectForLocator,
  onAskAi,
  userProfile,
  setUserProfile
}: SchemeWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Compute matched schemes using rule engine
  const matchResults = useMemo(() => {
    const results = matchSchemes(userProfile);
    if (selectedCategoryFilter === 'all') return results;
    return results.filter(r => r.scheme.categoryTag.toLowerCase().includes(selectedCategoryFilter.toLowerCase()) || r.scheme.id.includes(selectedCategoryFilter));
  }, [userProfile, selectedCategoryFilter]);

  // Demo Profiles for Judges
  const loadPreset = (presetType: 'nano' | 'women_shg' | 'education' | 'sanitation' | 'green') => {
    if (presetType === 'nano') {
      setUserProfile({
        name: 'Ramesh Kumar',
        age: 32,
        gender: 'male',
        category: 'SC',
        annualFamilyIncome: 140000,
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        projectType: 'micro_business',
        estimatedCost: 120000,
        ownContribution: 10000,
        educationStatus: '10th_pass',
        isPriorBeneficiary: false,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        hasDPR: false
      });
    } else if (presetType === 'women_shg') {
      setUserProfile({
        name: 'Sunita Devi & Ekta SHG',
        age: 38,
        gender: 'female',
        category: 'SC',
        annualFamilyIncome: 180000,
        state: 'Maharashtra',
        district: 'Pune',
        projectType: 'micro_business',
        estimatedCost: 140000,
        ownContribution: 10000,
        educationStatus: '10th_pass',
        isPriorBeneficiary: false,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        hasDPR: true
      });
    } else if (presetType === 'education') {
      setUserProfile({
        name: 'Amit Anand',
        age: 23,
        gender: 'male',
        category: 'SC',
        annualFamilyIncome: 320000,
        state: 'Delhi',
        district: 'Central Delhi',
        projectType: 'education_abroad',
        estimatedCost: 2500000,
        ownContribution: 150000,
        educationStatus: 'diploma_or_graduate',
        isPriorBeneficiary: false,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        hasDPR: true
      });
    } else if (presetType === 'sanitation') {
      setUserProfile({
        name: 'Vikas Valmiki',
        age: 35,
        gender: 'male',
        category: 'SafaiKaramchari',
        annualFamilyIncome: 160000,
        state: 'Delhi',
        district: 'East Delhi',
        projectType: 'sanitation_mech',
        estimatedCost: 1500000,
        ownContribution: 50000,
        educationStatus: 'below_10th',
        isPriorBeneficiary: false,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        hasDPR: true
      });
    } else if (presetType === 'green') {
      setUserProfile({
        name: 'Pooja Bharti',
        age: 29,
        gender: 'female',
        category: 'SC',
        annualFamilyIncome: 280000,
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        projectType: 'green_business',
        estimatedCost: 1800000,
        ownContribution: 180000,
        educationStatus: 'diploma_or_graduate',
        isPriorBeneficiary: false,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        hasDPR: true
      });
    }
    setStep(3); // jump directly to results
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Presets */}
      <div className="bg-gradient-to-r from-sky-950 via-blue-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-sky-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-semibold border border-sky-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" /> Scheme for your benefit
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Smart Scheme Recommender
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Match personalized concessional credit (6.5% - 8% p.a.) with government subsidies. Evaluates family income ceiling (≤ ₹5.00 Lakhs) and automatically prepares your application for authorized Channel Partners.
            </p>
          </div>

          {/* Quick Demo Presets Bar for Judges */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 shrink-0">
            <span className="text-[11px] font-bold text-amber-300 block mb-2 flex items-center gap-1 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Quick Beneficiary Profiles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                id="preset-nano"
                onClick={() => loadPreset('nano')}
                className="text-xs bg-slate-700 hover:bg-sky-700 text-white px-2.5 py-1 rounded-md transition-colors font-medium border border-slate-600"
              >
                Kirana / Nano (₹1.2L)
              </button>
              <button
                id="preset-women"
                onClick={() => loadPreset('women_shg')}
                className="text-xs bg-slate-700 hover:bg-pink-700 text-white px-2.5 py-1 rounded-md transition-colors font-medium border border-slate-600"
              >
                Women SHG (₹1.4L)
              </button>
              <button
                id="preset-edu"
                onClick={() => loadPreset('education')}
                className="text-xs bg-slate-700 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md transition-colors font-medium border border-slate-600"
              >
                Education Abroad (₹25L)
              </button>
              <button
                id="preset-sanitation"
                onClick={() => loadPreset('sanitation')}
                className="text-xs bg-slate-700 hover:bg-amber-700 text-white px-2.5 py-1 rounded-md transition-colors font-medium border border-slate-600"
              >
                Sanitation Mech (₹15L)
              </button>
              <button
                id="preset-green"
                onClick={() => loadPreset('green')}
                className="text-xs bg-slate-700 hover:bg-teal-700 text-white px-2.5 py-1 rounded-md transition-colors font-medium border border-slate-600"
              >
                Green Solar (₹18L)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            id="step-tab-1"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              step === 1 ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
            <span>Personal & Category</span>
          </button>
          <button
            id="step-tab-2"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              step === 2 ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
            <span>Project & Financials</span>
          </button>
          <button
            id="step-tab-3"
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              step === 3 ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
            <span>Matched Schemes ({matchResults.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            setUserProfile({
              name: '',
              age: 28,
              gender: 'male',
              category: 'SC',
              annualFamilyIncome: 200000,
              state: 'Delhi',
              district: 'Central Delhi',
              projectType: 'micro_business',
              estimatedCost: 150000,
              ownContribution: 15000,
              educationStatus: '12th_pass',
              isPriorBeneficiary: false,
              hasCasteCertificate: true,
              hasIncomeCertificate: true,
              hasDPR: false
            });
            setStep(1);
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Step 1: Personal & Category Profile */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Beneficiary Category & Demographics</h3>
            <p className="text-xs text-slate-500">Government concessional credit rules prioritize Scheduled Caste and marginalized groups.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Beneficiary / Applicant Name
              </label>
              <input
                type="text"
                id="input-name"
                value={userProfile.name}
                onChange={(e) => setUserProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ramesh Kumar"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Caste / Beneficiary Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Beneficiary Category <span className="text-sky-600 font-bold">*</span>
              </label>
              <select
                id="input-category"
                value={userProfile.category}
                onChange={(e) => setUserProfile(p => ({ ...p, category: e.target.value as BeneficiaryCategory }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="SC">Scheduled Caste (SC) - NSFDC Primary</option>
                <option value="SafaiKaramchari">Safai Karamchari / Manual Scavenger (NSKFDC)</option>
                <option value="OBC">Other Backward Class (NBCFDC)</option>
                <option value="ST">Scheduled Tribe (ST - NSTFDC)</option>
                <option value="Minority">Notified Minority (NMDFC)</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender (Special 1% Rebate for Female Applicants)
              </label>
              <select
                id="input-gender"
                value={userProfile.gender}
                onChange={(e) => setUserProfile(p => ({ ...p, gender: e.target.value as any }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="female">Female (Eligible for Mahila Samriddhi & Rebate)</option>
                <option value="male">Male</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (Must be between 18 and 65 years)
              </label>
              <input
                type="number"
                id="input-age"
                min="18"
                max="70"
                value={userProfile.age}
                onChange={(e) => setUserProfile(p => ({ ...p, age: parseInt(e.target.value) || 18 }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / UT (Determines State Channelizing Agency)
              </label>
              <select
                id="input-state"
                value={userProfile.state}
                onChange={(e) => setUserProfile(p => ({ ...p, state: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Delhi">Delhi (DSFDC)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (UPSCFDC)</option>
                <option value="Maharashtra">Maharashtra (MPBCDC)</option>
                <option value="Bihar">Bihar (BSSCCDC)</option>
                <option value="Karnataka">Karnataka (KADCL)</option>
                <option value="Tamil Nadu">Tamil Nadu (TAHDCO)</option>
                <option value="Rajasthan">Rajasthan (Anuja Nigam)</option>
                <option value="West Bengal">West Bengal (WBSCSTDFC)</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / Town
              </label>
              <input
                type="text"
                id="input-district"
                value={userProfile.district}
                onChange={(e) => setUserProfile(p => ({ ...p, district: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              id="next-step-1-btn"
              onClick={() => setStep(2)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Project & Financials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Project & Financial Parameters */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Step 2: Project Sector, Income & Cost Estimate</h3>
            <p className="text-xs text-slate-500">The channel finance router checks loan limits, income ceiling (≤ ₹5L), and subsidy eligibility.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Project / Purpose Type */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intended Project / Purpose Type <span className="text-sky-600 font-bold">*</span>
              </label>
              <select
                id="input-project-type"
                value={userProfile.projectType}
                onChange={(e) => setUserProfile(p => ({ ...p, projectType: e.target.value as ProjectType }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="micro_business">Micro Business / Nano Enterprise (Vendors, Tea-Stall, Tailoring, Petty Shop up to ₹1.5L)</option>
                <option value="term_loan_services">Services & Commercial (Auto repair, Printing, Medical clinic, Salon up to ₹50L)</option>
                <option value="term_loan_mfg">Manufacturing & Industrial (Agro-processing, Fabrication, Craft up to ₹50L)</option>
                <option value="transport_vehicle">Commercial Transport (E-Rickshaw, Auto, Small Goods Carrier)</option>
                <option value="green_business">Green Energy & Solar (Rooftop solar, Recycling, Bio-waste up to ₹30L)</option>
                <option value="sanitation_mech">Sanitation Mechanization (Suction trucks, Jetting machines up to ₹15L)</option>
                <option value="education_domestic">Higher Education in India (Engineering, Medical, MBA, Law up to ₹20L)</option>
                <option value="education_abroad">Higher Education Overseas (Approved Foreign Universities up to ₹30L)</option>
              </select>
            </div>

            {/* Education Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Educational Qualification
              </label>
              <select
                id="input-education-status"
                value={userProfile.educationStatus}
                onChange={(e) => setUserProfile(p => ({ ...p, educationStatus: e.target.value as any }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="below_10th">Below 10th Standard</option>
                <option value="10th_pass">10th Pass</option>
                <option value="12th_pass">12th Pass / Intermediate</option>
                <option value="diploma_or_graduate">Diploma / Graduate</option>
                <option value="postgraduate_or_professional">Postgraduate / Professional Degree</option>
              </select>
            </div>

            {/* Estimated Total Project / Study Cost */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Estimated Total Project Cost
                </label>
                <span className="text-xs font-bold text-sky-700 font-mono">
                  ₹{userProfile.estimatedCost.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                id="slider-cost"
                min="20000"
                max="5000000"
                step="20000"
                value={userProfile.estimatedCost}
                onChange={(e) => setUserProfile(p => ({ ...p, estimatedCost: parseInt(e.target.value) }))}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹20,000 (Micro)</span>
                <span>₹5 Lakh (Small)</span>
                <span>₹50 Lakh (Term Loan)</span>
              </div>
            </div>

            {/* Annual Family Income */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Annual Family Income (Limit: ₹5,00,000)
                </label>
                <span className={`text-xs font-bold font-mono ${userProfile.annualFamilyIncome <= 500000 ? 'text-sky-700' : 'text-rose-600'}`}>
                  ₹{userProfile.annualFamilyIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                id="slider-income"
                min="50000"
                max="1000000"
                step="25000"
                value={userProfile.annualFamilyIncome}
                onChange={(e) => setUserProfile(p => ({ ...p, annualFamilyIncome: parseInt(e.target.value) }))}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50,000 (BPL)</span>
                <span className="text-sky-600 font-semibold">₹5,00,000 (Ceiling)</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Own Equity / Promoter Contribution */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Own Contribution / Promoter Equity
                </label>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  ₹{userProfile.ownContribution.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                id="input-own-contribution"
                value={userProfile.ownContribution}
                onChange={(e) => setUserProfile(p => ({ ...p, ownContribution: parseInt(e.target.value) || 0 }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-500">Government schemes cover up to 90% (You need only 5-10%)</span>
            </div>
          </div>

          {/* Quick Checklist Checkbox Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Document Readiness Quick-Check:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-caste-cert"
                  checked={userProfile.hasCasteCertificate}
                  onChange={(e) => setUserProfile(p => ({ ...p, hasCasteCertificate: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Valid Caste Certificate (Tehsildar / SDO)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-income-cert"
                  checked={userProfile.hasIncomeCertificate}
                  onChange={(e) => setUserProfile(p => ({ ...p, hasIncomeCertificate: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Income Certificate (≤ ₹5.00 Lakhs)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  id="chk-dpr"
                  checked={userProfile.hasDPR}
                  onChange={(e) => setUserProfile(p => ({ ...p, hasDPR: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Project Report / Vendor Quotation (DPR)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200"
            >
              Back
            </button>
            <button
              id="match-schemes-btn"
              onClick={() => setStep(3)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Show Matched Schemes ({matchResults.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Real-time Matched Schemes Display */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                {matchResults.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Schemes Matched for {userProfile.name || 'Beneficiary'} ({userProfile.category})
                </h3>
                <p className="text-xs text-slate-500">
                  Income: ₹{(userProfile.annualFamilyIncome / 100000).toFixed(2)}L • Est. Cost: ₹{(userProfile.estimatedCost / 100000).toFixed(2)}L • {userProfile.state}
                </p>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Schemes' },
                { id: 'Nano', label: 'Micro / Nano' },
                { id: 'Commercial', label: 'Term Loans' },
                { id: 'Education', label: 'Higher Education' },
                { id: 'Green', label: 'Green Tech' },
                { id: 'Sanitation', label: 'Sanitation' }
              ].map(f => (
                <button
                  key={f.id}
                  id={`filter-${f.id}`}
                  onClick={() => setSelectedCategoryFilter(f.id)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                    selectedCategoryFilter === f.id
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {matchResults.map((result) => (
              <SchemeCard
                key={result.scheme.id}
                result={result}
                onSelectForCalculator={onSelectForCalculator}
                onSelectForLocator={onSelectForLocator}
                onAskAi={onAskAi}
              />
            ))}
          </div>

          {matchResults.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-semibold text-slate-700">No schemes matched the selected filter.</p>
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className="mt-2 text-xs font-semibold text-sky-600 underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
