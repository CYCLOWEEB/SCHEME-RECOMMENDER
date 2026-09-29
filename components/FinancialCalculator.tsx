'use client';

import React, { useState, useMemo } from 'react';
import { SCHEMES_DATABASE } from '@/lib/schemes-data';
import { formatINR } from './SchemeCard';
import { 
  Calculator, 
  IndianRupee, 
  Percent, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Download, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  PiggyBank
} from 'lucide-react';

interface FinancialCalculatorProps {
  preselectedSchemeId?: string;
  onSelectLocator?: (schemeId: string) => void;
}

export default function FinancialCalculator({
  preselectedSchemeId,
  onSelectLocator
}: FinancialCalculatorProps) {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    preselectedSchemeId || 'nsfdc-tls'
  );

  const selectedScheme = useMemo(() => {
    return SCHEMES_DATABASE.find(s => s.id === selectedSchemeId) || SCHEMES_DATABASE[0];
  }, [selectedSchemeId]);

  // Calculator state
  const [projectCost, setProjectCost] = useState<number>(
    selectedScheme ? Math.min(selectedScheme.maxProjectCost, 500000) : 500000
  );
  const [loanPercentage, setLoanPercentage] = useState<number>(
    selectedScheme ? selectedScheme.maxLoanPercentage : 90
  );
  const [interestRate, setInterestRate] = useState<number>(
    selectedScheme ? selectedScheme.concessionalInterestRate : 7.5
  );
  const [tenureYears, setTenureYears] = useState<number>(
    selectedScheme ? selectedScheme.repaymentTenureYears : 5
  );
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(
    selectedScheme ? selectedScheme.moratoriumPeriodMonths : 6
  );
  const [subsidyAmount, setSubsidyAmount] = useState<number>(
    selectedScheme?.subsidyAvailable ? 25000 : 0
  );

  // Update defaults when scheme changes
  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    const sch = SCHEMES_DATABASE.find(s => s.id === schemeId);
    if (sch) {
      const initCost = Math.min(sch.maxProjectCost, 500000);
      setProjectCost(initCost);
      setLoanPercentage(sch.maxLoanPercentage);
      setInterestRate(sch.concessionalInterestRate);
      setTenureYears(sch.repaymentTenureYears);
      setMoratoriumMonths(sch.moratoriumPeriodMonths);
      setSubsidyAmount(sch.subsidyAvailable ? (sch.id === 'nskfdc-srms' ? 250000 : 25000) : 0);
    }
  };

  // Calculations
  const calculatedLoanAmount = useMemo(() => {
    const rawLoan = (projectCost * loanPercentage) / 100;
    const effectiveLoan = Math.max(0, rawLoan - subsidyAmount);
    return Math.min(selectedScheme ? selectedScheme.maxLoanAmount : 5000000, effectiveLoan);
  }, [projectCost, loanPercentage, subsidyAmount, selectedScheme]);

  const promoterContribution = useMemo(() => {
    return Math.max(0, projectCost - calculatedLoanAmount - subsidyAmount);
  }, [projectCost, calculatedLoanAmount, subsidyAmount]);

  // Concessional EMI
  const { monthlyEmi, totalPayment, totalInterest } = useMemo(() => {
    const p = calculatedLoanAmount;
    const r = interestRate / (12 * 100);
    const n = tenureYears * 12;

    if (p <= 0 || n <= 0) return { monthlyEmi: 0, totalPayment: 0, totalInterest: 0 };
    if (r === 0) return { monthlyEmi: Math.round(p / n), totalPayment: p, totalInterest: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const roundedEmi = Math.round(emi);
    const totalPay = roundedEmi * n;
    const totalInt = totalPay - p;

    return {
      monthlyEmi: roundedEmi,
      totalPayment: totalPay,
      totalInterest: Math.max(0, totalInt)
    };
  }, [calculatedLoanAmount, interestRate, tenureYears]);

  // Commercial Benchmark (14% p.a.)
  const { commercialEmi, commercialTotalInterest, interestSaved } = useMemo(() => {
    const p = calculatedLoanAmount;
    const r = 14.0 / (12 * 100);
    const n = tenureYears * 12;

    if (p <= 0 || n <= 0) return { commercialEmi: 0, commercialTotalInterest: 0, interestSaved: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const commEmi = Math.round(emi);
    const commTotal = commEmi * n;
    const commInt = commTotal - p;
    const saved = Math.max(0, commInt - totalInterest);

    return {
      commercialEmi: commEmi,
      commercialTotalInterest: commInt,
      interestSaved: saved
    };
  }, [calculatedLoanAmount, tenureYears, totalInterest]);

  // Amortization slice preview (First 6 months)
  const amortizationPreview = useMemo(() => {
    const rows = [];
    let balance = calculatedLoanAmount;
    const monthlyRate = interestRate / (12 * 100);

    for (let m = 1; m <= Math.min(6, tenureYears * 12); m++) {
      const isMoratorium = m <= moratoriumMonths;
      const interestPart = Math.round(balance * monthlyRate);
      let principalPart = monthlyEmi - interestPart;
      let emiPaid = monthlyEmi;

      if (isMoratorium) {
        // Simple grace / interest-only
        emiPaid = interestPart;
        principalPart = 0;
      } else {
        balance = Math.max(0, balance - principalPart);
      }

      rows.push({
        month: m,
        isMoratorium,
        emi: emiPaid,
        principal: principalPart,
        interest: interestPart,
        closingBalance: balance
      });
    }
    return rows;
  }, [calculatedLoanAmount, interestRate, monthlyEmi, tenureYears, moratoriumMonths]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Dynamic Concessional EMI Simulator
            </span>
            <span className="text-xs text-slate-500">
              Moratorium Adjusted • Commercial Benchmark
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Financial & Scheme Repayment Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare subsidized rates (5.0% - 7.5% p.a.) vs commercial lenders (14.0% p.a.). Experience the 3-12 months grace moratorium.
          </p>
        </div>

        {/* Scheme Selector Dropdown */}
        <div className="min-w-[260px] bg-slate-50 border border-slate-200 rounded-xl p-3">
          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
            Choose Scheme Preset:
          </label>
          <select
            id="calc-scheme-select"
            value={selectedSchemeId}
            onChange={(e) => handleSchemeChange(e.target.value)}
            className="w-full text-xs font-semibold px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            {SCHEMES_DATABASE.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.concessionalInterestRate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Loan & Project Parameters
          </h3>

          {/* Project Cost Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Total Project / Education Cost
              </label>
              <span className="text-sm font-black text-slate-900 font-mono">
                {formatINR(projectCost)}
              </span>
            </div>
            <input
              type="range"
              id="slider-calc-cost"
              min="20000"
              max={selectedScheme.maxProjectCost}
              step="10000"
              value={projectCost}
              onChange={(e) => setProjectCost(parseInt(e.target.value))}
              className="w-full accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Min: ₹20,000</span>
              <span>Scheme Ceiling: {formatINR(selectedScheme.maxProjectCost)}</span>
            </div>
          </div>

          {/* Loan % and Subsidies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Loan Financing (% of Cost)
                </label>
                <span className="text-xs font-bold text-sky-700 font-mono">
                  {loanPercentage}%
                </span>
              </div>
              <input
                type="range"
                id="slider-calc-loan-pct"
                min="50"
                max={selectedScheme.maxLoanPercentage}
                step="5"
                value={loanPercentage}
                onChange={(e) => setLoanPercentage(parseInt(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-500">Max authorized: {selectedScheme.maxLoanPercentage}%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Capital Subsidy / Grant
                </label>
                <span className="text-xs font-bold text-amber-700 font-mono">
                  {formatINR(subsidyAmount)}
                </span>
              </div>
              <input
                type="range"
                id="slider-calc-subsidy"
                min="0"
                max="500000"
                step="5000"
                value={subsidyAmount}
                onChange={(e) => setSubsidyAmount(parseInt(e.target.value))}
                className="w-full accent-amber-600"
              />
              <span className="text-[10px] text-slate-500">Directly deducts from loan principal</span>
            </div>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Concessional Interest Rate
                </label>
                <span className="text-xs font-bold text-sky-700 font-mono">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                id="slider-calc-interest"
                min="4.0"
                max="15.0"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-500">Government subsidized rate</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Repayment Tenure (Years)
                </label>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {tenureYears} Years ({tenureYears * 12} EMIs)
                </span>
              </div>
              <input
                type="range"
                id="slider-calc-tenure"
                min="1"
                max={Math.max(selectedScheme.repaymentTenureYears, 10)}
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-500">Standard: {selectedScheme.repaymentTenureYears} Years</span>
            </div>
          </div>

          {/* Moratorium Period */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Moratorium Period (Grace Months Before Principal Repayment)
              </label>
              <span className="text-xs font-bold text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {moratoriumMonths} Months Grace
              </span>
            </div>
            <input
              type="range"
              id="slider-calc-moratorium"
              min="0"
              max="12"
              step="1"
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(parseInt(e.target.value))}
              className="w-full accent-amber-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Beneficiary advantage: During moratorium ({moratoriumMonths} months), you stabilize your enterprise without standard EMI pressure.
            </p>
          </div>

          {/* Capital Distribution Summary */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Net Loan Amount:</span>
              <span className="font-extrabold text-slate-900 text-sm">{formatINR(calculatedLoanAmount)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Promoter Margin:</span>
              <span className="font-extrabold text-indigo-700 text-sm">{formatINR(promoterContribution)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Government Subsidy:</span>
              <span className="font-extrabold text-amber-700 text-sm">{formatINR(subsidyAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right Outputs & Comparison Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main EMI Card */}
          <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-sky-700/60 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  Projected Monthly EMI
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                  Concessional Rate
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-sky-200 font-medium">/ month</span>
                </div>
                <p className="text-xs text-sky-100/80 mt-1">
                  Tenure: {tenureYears} Years ({tenureYears * 12} EMIs) at {interestRate}% p.a.
                </p>
              </div>

              {/* Total Interest & Cost Breakdown */}
              <div className="pt-3 border-t border-sky-700/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-sky-200 block text-[11px]">Total Interest:</span>
                  <span className="font-bold text-white text-sm">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-sky-200 block text-[11px]">Total Repayment:</span>
                  <span className="font-bold text-white text-sm">₹{totalPayment.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Bank Comparison Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Comparison: Commercial vs NSFDC Scheme
              </h4>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                14% Market Rate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Commercial Bank EMI:</span>
                <span className="text-sm font-bold text-slate-800">₹{commercialEmi.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200">
                <span className="text-sky-800 block text-[10px]">Scheme EMI:</span>
                <span className="text-sm font-bold text-sky-700">₹{monthlyEmi.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>

            {/* Huge Savings Badge */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-sky-900 block">
                    Total Interest Saved by Beneficiary:
                  </span>
                  <span className="text-xs text-slate-600">Over entire {tenureYears}-year tenure</span>
                </div>
              </div>
              <span className="text-base font-black text-sky-700">
                +{formatINR(interestSaved)}
              </span>
            </div>
          </div>

          {/* Moratorium Timeline Breakdown Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">
              Repayment Schedule (First 6 Months)
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {amortizationPreview.map(row => (
                <div 
                  key={row.month} 
                  className={`flex items-center justify-between p-1.5 rounded-md ${
                    row.isMoratorium ? 'bg-amber-50 text-amber-900 border border-amber-200/60' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-semibold">Month {row.month}:</span>
                  <span>{row.isMoratorium ? `Grace (₹${row.emi.toLocaleString('en-IN')})` : `EMI: ₹${row.emi.toLocaleString('en-IN')}`}</span>
                  <span className="text-slate-500 text-[11px]">Bal: ₹{row.closingBalance.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
