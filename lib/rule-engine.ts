import { Scheme, UserProfile, SchemeMatchResult } from './types';
import { SCHEMES_DATABASE } from './schemes-data';

export function calculateEmi(principal: number, annualRatePct: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualRatePct / (12 * 100);
  const totalMonths = tenureYears * 12;
  
  if (monthlyRate === 0) return Math.round(principal / totalMonths);
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

export function matchSchemes(profile: UserProfile): SchemeMatchResult[] {
  const results: SchemeMatchResult[] = [];

  for (const scheme of SCHEMES_DATABASE) {
    let score = 0;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    // 1. Beneficiary Category Check
    const isCategoryMatched = scheme.targetBeneficiaries.includes(profile.category) ||
      (profile.category === 'SafaiKaramchari' && scheme.id === 'nskfdc-srms') ||
      (profile.category === 'SC');

    if (isCategoryMatched) {
      score += 30;
      matchReasons.push(`Target beneficiary group matched (${profile.category} eligible under ${scheme.corporation})`);
    } else {
      caveats.push(`Scheme primary target is ${scheme.targetBeneficiaries.join(', ')}. Priority processing applies to designated category.`);
    }

    // 2. Annual Family Income Ceiling Check (Standard is <= ₹5,00,000)
    if (profile.annualFamilyIncome <= scheme.maxIncomeCeiling) {
      score += 25;
      matchReasons.push(`Family income (₹${(profile.annualFamilyIncome / 100000).toFixed(2)}L) is within the concessional limit of ₹${(scheme.maxIncomeCeiling / 100000).toFixed(2)}L`);
      if (profile.annualFamilyIncome <= 150000) {
        score += 5; // BPL / Double Below Poverty Line priority
        matchReasons.push('BPL / Priority income category unlocks additional state capital subsidies');
      }
    } else {
      score -= 20;
      caveats.push(`Family income exceeds the standard ceiling of ₹${(scheme.maxIncomeCeiling / 100000).toFixed(2)}L for this concessional scheme`);
    }

    // 3. Project Type & Purpose Fit
    if (scheme.projectTypes.includes(profile.projectType)) {
      score += 25;
      matchReasons.push(`Project sector matches scheme focus (${scheme.categoryTag})`);
    } else {
      // General cross-fit
      if (profile.projectType.startsWith('term_loan') && scheme.id === 'nsfdc-tls') {
        score += 20;
      } else if (profile.projectType === 'micro_business' && (scheme.id === 'nsfdc-mfs' || scheme.id === 'nsfdc-msy' || scheme.id === 'nsfdc-lvy')) {
        score += 22;
      } else {
        score -= 10;
        caveats.push(`Not the primary sector for this scheme (${scheme.categoryTag})`);
      }
    }

    // 4. Financial Scale & Loan Amount Fit
    const userReqCost = profile.estimatedCost;
    if (userReqCost <= scheme.maxProjectCost) {
      score += 15;
      matchReasons.push(`Project scale (₹${(userReqCost / 100000).toFixed(2)}L) is within maximum ceiling of ₹${(scheme.maxProjectCost / 100000).toFixed(2)}L`);
    } else {
      score -= 15;
      caveats.push(`Project cost (₹${(userReqCost / 100000).toFixed(2)}L) exceeds the scheme maximum of ₹${(scheme.maxProjectCost / 100000).toFixed(2)}L`);
    }

    // 5. Gender Specific Perks (Women entrepreneurs)
    if (profile.gender === 'female' && scheme.womenRebatePercentage) {
      score += 5;
      matchReasons.push(`Eligible for women concessional interest rebate of ${scheme.womenRebatePercentage}% p.a.`);
    }

    // 6. Education qualification check for ELS
    if (scheme.id === 'nsfdc-els') {
      if (profile.educationStatus === 'diploma_or_graduate' || profile.educationStatus === 'postgraduate_or_professional' || profile.educationStatus === '12th_pass') {
        score += 5;
        matchReasons.push('Educational prerequisites verified for higher professional degree credit');
      } else {
        score -= 20;
        caveats.push('Admission to approved higher degree required for educational loan');
      }
    }

    // Compute loan amounts
    const maxLoanAllowed = Math.min(
      scheme.maxLoanAmount,
      (userReqCost * scheme.maxLoanPercentage) / 100
    );
    const loanAmount = Math.max(0, maxLoanAllowed);
    const promoterEquity = Math.max(0, userReqCost - loanAmount);

    // Concessional rate calculation
    let effectiveRate = scheme.concessionalInterestRate;
    if (profile.gender === 'female' && scheme.womenRebatePercentage) {
      effectiveRate = Math.max(3.5, effectiveRate - scheme.womenRebatePercentage);
    }

    const tenure = scheme.repaymentTenureYears;
    const emi = calculateEmi(loanAmount, effectiveRate, tenure);
    
    // Commercial benchmark: 14% commercial bank interest without moratorium
    const commercialEmi = calculateEmi(loanAmount, 14.0, tenure);
    const totalConcessionalInterest = (emi * tenure * 12) - loanAmount;
    const totalCommercialInterest = (commercialEmi * tenure * 12) - loanAmount;
    const interestSaved = Math.max(0, totalCommercialInterest - totalConcessionalInterest);

    // Clamp score
    const finalScore = Math.min(99, Math.max(10, score));
    const isFullyEligible = profile.annualFamilyIncome <= scheme.maxIncomeCeiling && 
                            isCategoryMatched && 
                            userReqCost <= (scheme.maxProjectCost * 1.15);

    results.push({
      scheme,
      matchScore: finalScore,
      isFullyEligible,
      matchReasons,
      caveats,
      recommendedLoanAmount: loanAmount,
      promoterContributionNeeded: promoterEquity,
      estimatedMonthlyEmi: emi,
      interestSavedVsCommercial: interestSaved
    });
  }

  // Sort by highest match score first
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
