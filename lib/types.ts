export type BeneficiaryCategory = 'SC' | 'ST' | 'OBC' | 'SafaiKaramchari' | 'Minority' | 'General';

export type ProjectType = 
  | 'micro_business'      // Petty shops, street vendors, tailoring, small kiosks
  | 'term_loan_services'  // Service sector: clinics, repair centers, printing, cafes
  | 'term_loan_mfg'       // Manufacturing, agro-processing, fabrication, handicrafts
  | 'transport_vehicle'   // Commercial e-rickshaw, auto, small goods carrier
  | 'green_business'      // Solar rooftop, biogas, eco-friendly recycling
  | 'sanitation_mech'     // Suction machines, sewer cleaning, waste transport
  | 'education_domestic'  // Higher education in India
  | 'education_abroad';   // Higher education overseas

export interface Scheme {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  corporation: 'NSFDC' | 'NSKFDC' | 'NBCFDC' | 'Ministry of Social Justice';
  categoryTag: string;
  targetBeneficiaries: BeneficiaryCategory[];
  projectTypes: ProjectType[];
  maxProjectCost: number; // in INR
  maxLoanPercentage: number; // e.g. 90%
  maxLoanAmount: number; // in INR
  concessionalInterestRate: number; // e.g. 6.5% p.a.
  womenRebatePercentage?: number; // e.g. 1.0% discount for women
  moratoriumPeriodMonths: number; // e.g. 6 to 12 months
  repaymentTenureYears: number; // e.g. 5 to 10 years
  maxIncomeCeiling: number; // e.g. 5,00,000 INR
  subsidyAvailable: boolean;
  subsidyDetails: string;
  promoterContributionMinPercent: number; // e.g. 5% to 10%
  channelPartnerTypes: ('SCA' | 'PSB' | 'RRB' | 'NBFC_MFI')[];
  overview: string;
  keyBenefits: string[];
  mandatoryDocuments: string[];
  eligibilityBullets: string[];
}

export type PartnerType = 'SCA' | 'PSB' | 'RRB' | 'NBFC_MFI';

export type NpaStatus = 'HEALTHY_ACTIVE' | 'QUOTA_RESTRICTED' | 'HIGH_NPA_SUSPENDED';

export interface ChannelPartner {
  id: string;
  name: string;
  type: PartnerType;
  branchName: string;
  state: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  nodalOfficer: string;
  supportedSchemes: string[]; // Scheme IDs
  npaRate: number; // Percentage, e.g. 2.4%
  fundAllocationRemainingPercent: number; // e.g. 78% remaining
  npaStatus: NpaStatus;
  statusReason: string;
  turnaroundTimeDays: number; // e.g. 14 days
  rating: number; // e.g. 4.7
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'transgender' | 'prefer_not_to_say';
  category: BeneficiaryCategory;
  annualFamilyIncome: number;
  state: string;
  district: string;
  projectType: ProjectType;
  estimatedCost: number;
  ownContribution: number;
  educationStatus: 'below_10th' | '10th_pass' | '12th_pass' | 'diploma_or_graduate' | 'postgraduate_or_professional';
  isPriorBeneficiary: boolean;
  hasCasteCertificate: boolean;
  hasIncomeCertificate: boolean;
  hasDPR: boolean;
  locationCoords?: {
    lat: number;
    lng: number;
  };
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number; // 0 to 100
  isFullyEligible: boolean;
  matchReasons: string[];
  caveats: string[];
  recommendedLoanAmount: number;
  promoterContributionNeeded: number;
  estimatedMonthlyEmi: number;
  interestSavedVsCommercial: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  required: boolean;
  isUploaded: boolean;
  sampleFormatUrl?: string;
  verificationStatus: 'verified' | 'pending' | 'missing';
}
