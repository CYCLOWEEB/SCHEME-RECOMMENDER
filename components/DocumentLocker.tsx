'use client';

import React, { useState } from 'react';
import { DocumentItem, UserProfile } from '@/lib/types';
import { 
  FileCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  QrCode,
  Building2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentLockerProps {
  userProfile: UserProfile;
  selectedSchemeName?: string;
}

export default function DocumentLocker({
  userProfile,
  selectedSchemeName = 'Term Loan Scheme (NSFDC-TLS-03)'
}: DocumentLockerProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-caste',
      title: 'Scheduled Caste (SC) Certificate',
      hindiTitle: 'अनुसूचित जाति प्रमाण पत्र',
      description: 'Digitally signed certificate issued by Tehsildar, Sub-Divisional Magistrate (SDM), or Revenue Officer.',
      required: true,
      isUploaded: true,
      verificationStatus: 'verified'
    },
    {
      id: 'doc-income',
      title: 'Annual Family Income Certificate (≤ ₹5.00 Lakhs)',
      hindiTitle: 'पारिवारिक आय प्रमाण पत्र',
      description: 'Current financial year certificate from Competent Authority establishing family income is below ₹5,00,000.',
      required: true,
      isUploaded: true,
      verificationStatus: 'verified'
    },
    {
      id: 'doc-dpr',
      title: 'Detailed Project Report (DPR) / Quotation',
      hindiTitle: 'विस्तृत परियोजना रिपोर्ट / कोटेशन',
      description: 'Estimate of machinery, tools, raw materials, or fee structure from accredited vendors or university.',
      required: true,
      isUploaded: false,
      verificationStatus: 'pending'
    },
    {
      id: 'doc-kyc',
      title: 'Aadhaar Card & PAN Card',
      hindiTitle: 'आधार कार्ड एवं पैन कार्ड',
      description: 'Proof of identity with active mobile number linked for Aadhaar OTP verification.',
      required: true,
      isUploaded: true,
      verificationStatus: 'verified'
    },
    {
      id: 'doc-bank',
      title: 'Bank Passbook with NPCI Seeding',
      hindiTitle: 'बैंक पासबुक (डीबीटी / एनपीसीआई लिंक)',
      description: 'Bank account statement showing active IFSC, account number, and Aadhaar DBT seeding for direct subsidy credit.',
      required: true,
      isUploaded: false,
      verificationStatus: 'missing'
    }
  ]);

  const [showApplicationDossier, setShowApplicationDossier] = useState<boolean>(false);

  // Toggle document upload / verified state
  const handleToggleDoc = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const nextStatus = doc.verificationStatus === 'verified' ? 'pending' : 'verified';
        return {
          ...doc,
          isUploaded: nextStatus === 'verified',
          verificationStatus: nextStatus
        };
      }
      return doc;
    }));
  };

  // Readiness Score
  const verifiedCount = documents.filter(d => d.verificationStatus === 'verified').length;
  const readinessPercent = Math.round((verifiedCount / documents.length) * 100);

  const handleGeneratePacket = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
    setShowApplicationDossier(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker & Document Readiness Engine
            </span>
            <span className="text-xs text-slate-500">
              Direct Channel Finance Verification
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Document Readiness Locker & Application Packet
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prevent rejected applications. Check your mandatory papers against National Scheduled Castes Finance Corp (NSFDC) standards before visiting the Channel Partner.
          </p>
        </div>

        {/* Readiness Meter Gauge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[240px] text-right">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Readiness Score:</span>
            <span className="text-sky-700 font-extrabold text-sm">{readinessPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {verifiedCount} of {documents.length} verified documents ready
          </span>
        </div>
      </div>

      {/* Main Document Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            id={`doc-card-${doc.id}`}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    doc.verificationStatus === 'verified'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {doc.hindiTitle}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  doc.verificationStatus === 'verified'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.verificationStatus === 'verified' ? '✓ Verified' : 'Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {doc.required ? 'Mandatory for Loan Sanction' : 'Optional'}
              </span>

              <button
                id={`upload-toggle-${doc.id}`}
                onClick={() => handleToggleDoc(doc.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  doc.verificationStatus === 'verified'
                    ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {doc.verificationStatus === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Attached</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                    <span>Upload / Verify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar for Generating Application Packet */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Instant Application Dossier Generator
          </span>
          <h3 className="text-lg font-black mt-1">
            Ready to apply at the nearest Channel Partner?
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Compile your verified details, rule-engine eligibility score, and recommended scheme into a single official PDF-style pre-application docket.
          </p>
        </div>

        <button
          id="generate-packet-btn"
          onClick={handleGeneratePacket}
          className="bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Generate Pre-Application Docket</span>
        </button>
      </div>

      {/* Official Government Pre-Application Dossier Modal / View */}
      {showApplicationDossier && (
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          {/* Government Formal Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="flex justify-between items-start mb-2">
              <div className="text-left text-xs font-mono text-slate-500">
                <p>Form ID: <b>CFS-2026-SSR</b></p>
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
              </div>

              {/* National Emblem Representation */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-800 text-lg">
                  सत्य
                </div>
                <h4 className="text-sm font-black text-slate-900 tracking-wider uppercase mt-1">
                  Government of India
                </h4>
                <p className="text-[11px] font-semibold text-slate-600">
                  National Scheduled Castes Finance and Development Corporation (NSFDC)
                </p>
              </div>

              {/* QR Code Placeholder */}
              <div className="p-2 border border-slate-200 rounded-lg text-center">
                <QrCode className="w-10 h-10 mx-auto text-slate-800" />
                <span className="text-[9px] font-mono text-slate-500 block">DigiVerify QR</span>
              </div>
            </div>

            <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 bg-slate-100 py-1.5 px-4 rounded-md inline-block">
              Preliminary Channel Finance Scheme Dossier
            </h3>
          </div>

          {/* Dossier Body Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 border border-slate-200 p-3.5 rounded-xl bg-slate-50/60">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Section A: Beneficiary Demographics
              </span>
              <div className="flex justify-between"><span className="text-slate-500">Applicant Name:</span><span className="font-bold text-slate-900">{userProfile.name || 'Ramesh Kumar'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="font-bold text-slate-900">{userProfile.category} (Scheduled Caste)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Family Annual Income:</span><span className="font-bold text-sky-700">₹{userProfile.annualFamilyIncome.toLocaleString('en-IN')} (Eligible &lt; ₹5L)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">State / Domicile:</span><span className="font-bold text-slate-900">{userProfile.state} ({userProfile.district})</span></div>
            </div>

            <div className="space-y-2 border border-slate-200 p-3.5 rounded-xl bg-slate-50/60">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Section B: Scheme & Financing
              </span>
              <div className="flex justify-between"><span className="text-slate-500">Selected Scheme:</span><span className="font-bold text-slate-900">{selectedSchemeName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Estimated Project Cost:</span><span className="font-bold text-slate-900">₹{userProfile.estimatedCost.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Concessional Interest:</span><span className="font-bold text-sky-700">6.5% - 7.5% p.a.</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Moratorium Grace:</span><span className="font-bold text-slate-900">3 to 6 Months</span></div>
            </div>
          </div>

          {/* Verification Audit Checklist */}
          <div className="border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
              Section C: Document Verification Audit
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${d.verificationStatus === 'verified' ? 'text-sky-600' : 'text-slate-300'}`} />
                  <span className={d.verificationStatus === 'verified' ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>
                    {d.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Certification */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">Applicant Declaration & Non-Brokerage Guarantee:</p>
            <p>
              I hereby certify that all information provided is accurate under penalty of law. I understand that government channel finance involves NO agent commissions or fees.
            </p>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setShowApplicationDossier(false)}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Close Preview
            </button>
            <button
              onClick={() => window.print()}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as Official PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
