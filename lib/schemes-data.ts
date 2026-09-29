import { Scheme } from './types';

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'nsfdc-mfs',
    code: 'NSFDC-MFS-01',
    name: 'Micro Finance Scheme (MFS)',
    hindiName: 'लघु वित्त योजना (माइक्रो फाइनेंस)',
    corporation: 'NSFDC',
    categoryTag: 'Nano & Petty Enterprise',
    targetBeneficiaries: ['SC'],
    projectTypes: ['micro_business', 'transport_vehicle'],
    maxProjectCost: 150000,
    maxLoanPercentage: 90,
    maxLoanAmount: 140000,
    concessionalInterestRate: 6.5,
    womenRebatePercentage: 0.5,
    moratoriumPeriodMonths: 3,
    repaymentTenureYears: 3,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'State Channelizing Agencies (SCAs) provide capital subsidy up to ₹10,000 or 10% for BPL families.',
    promoterContributionMinPercent: 5,
    channelPartnerTypes: ['SCA', 'NBFC_MFI', 'RRB', 'PSB'],
    overview: 'Direct micro-credit routed through SCAs and NBFC-MFIs for small business units like vegetable vending, tailoring, tea-stalls, and rural artisans.',
    keyBenefits: [
      'Low interest rate of 6.5% per annum',
      'No collateral requirement for loans up to ₹1.40 Lakh',
      'Flexible weekly or monthly repayment cycles via local SHGs and MFIs',
      'Quick processing within 10 to 14 days'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate from Tehsildar / SDO',
      'Family Income Certificate (<= ₹5.0 Lakhs p.a.)',
      'Aadhaar Card & Voter ID',
      'Bank Account Passbook with Aadhaar seeding',
      'Simple Business Activity Quotation / Expense Sheet'
    ],
    eligibilityBullets: [
      'Must belong to Scheduled Caste (SC) community',
      'Annual family income must not exceed ₹5,00,000',
      'Age between 18 to 65 years',
      'Should not be a defaulter to any commercial bank or SCA'
    ]
  },
  {
    id: 'nsfdc-msy',
    code: 'NSFDC-MSY-02',
    name: 'Mahila Samriddhi Yojana (MSY)',
    hindiName: 'महिला समृद्धि योजना',
    corporation: 'NSFDC',
    categoryTag: 'Women Empowerment & Self-Help',
    targetBeneficiaries: ['SC'],
    projectTypes: ['micro_business'],
    maxProjectCost: 140000,
    maxLoanPercentage: 95,
    maxLoanAmount: 140000,
    concessionalInterestRate: 6.0,
    womenRebatePercentage: 1.0,
    moratoriumPeriodMonths: 4,
    repaymentTenureYears: 3.5,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'Special interest rebate of 1% and potential capital grant under state women development schemes.',
    promoterContributionMinPercent: 5,
    channelPartnerTypes: ['SCA', 'NBFC_MFI', 'RRB'],
    overview: 'Exclusive concessional credit for Scheduled Caste women entrepreneurs and Self Help Groups (SHGs) to achieve financial independence.',
    keyBenefits: [
      'Concessional interest rate of only 6.0% p.a.',
      'Up to 95% project cost funded under NSFDC share',
      'Grace moratorium of 4 months before EMI starts',
      'Group guarantee / SHG mode allowed without property mortgage'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate',
      'Income Certificate (<= ₹5 Lakhs)',
      'SHG Registration certificate or individual KYC',
      'Bank Account Passbook (single or joint SHG)',
      'Activity Plan / Equipment quotation'
    ],
    eligibilityBullets: [
      'Exclusively for Scheduled Caste female applicants / SHG members',
      'Annual family income under ₹5.00 Lakhs',
      'Age between 18 and 60 years'
    ]
  },
  {
    id: 'nsfdc-tls',
    code: 'NSFDC-TLS-03',
    name: 'Term Loan Scheme (TLS)',
    hindiName: 'सावधि ऋण योजना (टर्म लोन)',
    corporation: 'NSFDC',
    categoryTag: 'Commercial & Industrial Enterprise',
    targetBeneficiaries: ['SC'],
    projectTypes: ['term_loan_services', 'term_loan_mfg', 'transport_vehicle'],
    maxProjectCost: 5000000,
    maxLoanPercentage: 90,
    maxLoanAmount: 4500000,
    concessionalInterestRate: 7.5,
    womenRebatePercentage: 0.5,
    moratoriumPeriodMonths: 9,
    repaymentTenureYears: 7,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'Eligible for Stand-Up India and state MSME capital subsidy of up to 15% on machinery.',
    promoterContributionMinPercent: 10,
    channelPartnerTypes: ['SCA', 'PSB', 'RRB'],
    overview: 'Substantial medium and long term loan assistance for viable projects up to ₹50.00 Lakhs in manufacturing, processing, healthcare, logistics, and services.',
    keyBenefits: [
      'Substantial project size up to ₹50 Lakhs (loan up to ₹45 Lakhs)',
      'Interest rate of 7.5% p.a. vs 12-14% at commercial lenders',
      'Long repayment horizon up to 7-10 years',
      'Extended 9-12 months moratorium period during setup phase'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate',
      'Income Certificate (<= ₹5 Lakhs)',
      'Detailed Project Report (DPR) with cashflow projections',
      'Machinery & civil works quotations from authorized dealers',
      'PAN, Aadhaar, and 12-month Bank Statement',
      'Premises rent agreement or title deed'
    ],
    eligibilityBullets: [
      'Scheduled Caste entrepreneur having technical or business skill',
      'Family income ceiling of ₹5.00 Lakhs per annum',
      'Feasible Detailed Project Report (DPR) verified by Channel Partner'
    ]
  },
  {
    id: 'nsfdc-els',
    code: 'NSFDC-ELS-04',
    name: 'Educational Loan Scheme (ELS)',
    hindiName: 'शिक्षा ऋण योजना (उच्च शिक्षा)',
    corporation: 'NSFDC',
    categoryTag: 'Professional Higher Education',
    targetBeneficiaries: ['SC'],
    projectTypes: ['education_domestic', 'education_abroad'],
    maxProjectCost: 3000000,
    maxLoanPercentage: 90,
    maxLoanAmount: 3000000, // 20L India, 30L Abroad
    concessionalInterestRate: 6.5,
    womenRebatePercentage: 0.5,
    moratoriumPeriodMonths: 12,
    repaymentTenureYears: 10,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'Full interest subsidy during study & moratorium period under Dr. Ambedkar Central Sector Scheme for OBC/EBC/SC.',
    promoterContributionMinPercent: 5,
    channelPartnerTypes: ['SCA', 'PSB', 'RRB'],
    overview: 'Provides concessional educational credit up to ₹20 Lakhs for professional courses in India and ₹30 Lakhs for approved international universities.',
    keyBenefits: [
      'Interest rate of just 6.5% p.a. (6.0% for female students)',
      '12-month moratorium post course completion or 6 months after employment',
      'Covers tuition fees, books, laptops, hostel accommodation, and travel passage',
      '10-year flexible repayment window'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate',
      'Family Income Certificate (<= ₹5 Lakhs)',
      'Admission confirmation letter from recognized university/college',
      'Fee breakdown schedule on university letterhead',
      '10th, 12th, and Graduation mark sheets',
      'Parent/Guardian co-borrower KYC'
    ],
    eligibilityBullets: [
      'Must have secured admission to approved engineering, medical, law, MBA, MCA, or higher degree',
      'Family income <= ₹5.00 Lakhs p.a.',
      'Indian citizenship and Scheduled Caste domicile'
    ]
  },
  {
    id: 'nsfdc-gbs',
    code: 'NSFDC-GBS-05',
    name: 'Green Business Scheme (GBS)',
    hindiName: 'हरित व्यापार योजना (ग्रीन बिजनेस)',
    corporation: 'NSFDC',
    categoryTag: 'Renewable & Climate Tech',
    targetBeneficiaries: ['SC'],
    projectTypes: ['green_business', 'transport_vehicle'],
    maxProjectCost: 3000000,
    maxLoanPercentage: 90,
    maxLoanAmount: 2700000,
    concessionalInterestRate: 6.5,
    womenRebatePercentage: 0.5,
    moratoriumPeriodMonths: 6,
    repaymentTenureYears: 6,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'MNRE solar subsidies and PM Surya Ghar grants stackable with NSFDC loan.',
    promoterContributionMinPercent: 10,
    channelPartnerTypes: ['SCA', 'PSB', 'RRB'],
    overview: 'Financial assistance to SC entrepreneurs for income-generating activities that address climate change like solar PV units, e-rickshaw fleets, and organic recycling.',
    keyBenefits: [
      'Concessional interest rate of 6.5% p.a.',
      'Covers solar equipment, battery charging stations, and eco-transport',
      '6 months initial moratorium',
      'Priority routing at State Channelizing Agencies'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate',
      'Income Certificate (<= ₹5 Lakhs)',
      'Technical specification sheet of solar/green equipment',
      'Quotation from MNRE/state nodal accredited green vendor',
      'KYC and project site details'
    ],
    eligibilityBullets: [
      'Scheduled Caste beneficiaries starting green or energy efficiency initiatives',
      'Family income within ₹5.00 Lakhs per year limit',
      'Clean credit history'
    ]
  },
  {
    id: 'nsfdc-lvy',
    code: 'NSFDC-LVY-06',
    name: 'Laghu Vyavasay Yojana (Small Business)',
    hindiName: 'लघु व्यवसाय योजना',
    corporation: 'NSFDC',
    categoryTag: 'Retail & Local Services',
    targetBeneficiaries: ['SC'],
    projectTypes: ['micro_business', 'term_loan_services'],
    maxProjectCost: 500000,
    maxLoanPercentage: 90,
    maxLoanAmount: 450000,
    concessionalInterestRate: 7.0,
    womenRebatePercentage: 0.5,
    moratoriumPeriodMonths: 6,
    repaymentTenureYears: 5,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'State SCA subsidy of ₹10,000 to ₹25,000 according to state social welfare policies.',
    promoterContributionMinPercent: 5,
    channelPartnerTypes: ['SCA', 'PSB', 'RRB', 'NBFC_MFI'],
    overview: 'Quick credit support for setting up retail shops, computer hardware kiosks, beauty salons, electrical repair centers, and tailoring hubs.',
    keyBenefits: [
      'Up to ₹4.50 Lakh loan with low 5% promoter equity',
      'Moderate 7.0% interest rate with 6 months moratorium',
      '5 years easy repayment',
      'Supported by broad network of SCAs and Public Sector Banks'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate',
      'Income Certificate (<= ₹5 Lakhs)',
      'Shop establishment estimate or tool kit quotation',
      'Aadhaar, PAN & Bank Account statement'
    ],
    eligibilityBullets: [
      'SC individual with commercial aptitude or trade certificate',
      'Family income <= ₹5.00 Lakhs p.a.'
    ]
  },
  {
    id: 'nskfdc-srms',
    code: 'NSKFDC-SRMS-07',
    name: 'Sanitation Entrepreneur Scheme (SRMS)',
    hindiName: 'स्वच्छता उद्यमी योजना (सफाई कर्मचारी)',
    corporation: 'NSKFDC',
    categoryTag: 'Mechanized Sanitation & Dignity',
    targetBeneficiaries: ['SC', 'SafaiKaramchari'],
    projectTypes: ['sanitation_mech', 'transport_vehicle'],
    maxProjectCost: 1500000,
    maxLoanPercentage: 90,
    maxLoanAmount: 1350000,
    concessionalInterestRate: 5.0,
    womenRebatePercentage: 1.0,
    moratoriumPeriodMonths: 6,
    repaymentTenureYears: 5,
    maxIncomeCeiling: 500000,
    subsidyAvailable: true,
    subsidyDetails: 'Direct capital subsidy up to ₹5.00 Lakhs (33%-50% based on scheme slabs) under NAMASTE / SRMS.',
    promoterContributionMinPercent: 5,
    channelPartnerTypes: ['SCA', 'PSB', 'RRB'],
    overview: 'Promotes mechanized sewer and septic tank cleaning to eliminate manual scavenging, providing mechanized vacuum suction trucks and personal safety cleaning gear.',
    keyBenefits: [
      'Lowest subsidized interest rate: 4.0% to 5.0% p.a.',
      'Massive upfront capital subsidy up to ₹5,00,000',
      'Guaranteed tie-ups with Urban Local Bodies (ULBs) for municipal contracts',
      'Provides dignity and entrepreneurial ownership to sanitation workers'
    ],
    mandatoryDocuments: [
      'Safai Karamchari / Manual Scavenger certificate or SC certificate',
      'Income Certificate',
      'Suction Machine / Vehicle manufacturer quotation',
      'Driving license / commercial vehicle permit where applicable'
    ],
    eligibilityBullets: [
      'Identified sanitation worker, manual scavenger or dependent',
      'SC background prioritized',
      'Commitment to operate mechanized equipment safely'
    ]
  },
  {
    id: 'msje-vcf-sc',
    code: 'MSJE-VCF-08',
    name: 'Venture Capital Fund for Scheduled Castes (VCF-SC)',
    hindiName: 'अनुसूचित जाति उद्यम पूंजी कोष',
    corporation: 'Ministry of Social Justice',
    categoryTag: 'Startup & High Growth Venture',
    targetBeneficiaries: ['SC'],
    projectTypes: ['term_loan_mfg', 'term_loan_services', 'green_business'],
    maxProjectCost: 50000000, // 500 Lakhs
    maxLoanPercentage: 75,
    maxLoanAmount: 37500000, // 3.75 Crores
    concessionalInterestRate: 8.0,
    womenRebatePercentage: 0.25,
    moratoriumPeriodMonths: 12,
    repaymentTenureYears: 8,
    maxIncomeCeiling: 1000000, // Flexible for corporate SC founders
    subsidyAvailable: false,
    subsidyDetails: 'Concessional debt/equity blend with handholding mentoring from IFCI Venture Capital.',
    promoterContributionMinPercent: 20,
    channelPartnerTypes: ['PSB', 'SCA'],
    overview: 'High-ticket venture assistance for SC entrepreneurs scaling technology, manufacturing, pharma, and industrial businesses.',
    keyBenefits: [
      'Funding from ₹15 Lakhs up to ₹5.00 Crores',
      'Equity or concessional debt at 8.0% p.a.',
      'Long 8-year investment horizon with 12 months moratorium',
      'Mentorship from IFCI and national industrial panels'
    ],
    mandatoryDocuments: [
      'SC Caste Certificate of majority shareholders (>51% SC owned)',
      'Comprehensive DPR with 5-year financial projections',
      'Company incorporation certificate, GST, Udyam Registration',
      'Audited financial statements or projected balance sheets'
    ],
    eligibilityBullets: [
      'Company/Firm where SC entrepreneurs hold minimum 51% equity stake',
      'Viable tech or commercial business model',
      'Good credit and tax track record'
    ]
  }
];
