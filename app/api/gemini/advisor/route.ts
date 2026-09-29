import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { query, language = 'en', schemeName, userProfile } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const systemInstruction = `
You are "Yojna Mitra" (योजना मित्र) / "Seva Vaani", an expert AI Assistant specialized in Government of India Concessional Credit Schemes and Educational Loans for Scheduled Caste (SC) beneficiaries, sanitation workers (Safai Karamcharis), and marginalized entrepreneurs under the Channel Finance System (NSFDC, NSKFDC, NBCFDC, and Ministry of Social Justice & Empowerment).

Core Knowledge Context:
- Direct loan applications are NOT taken at central headquarters; all funds are routed through the Channel Finance System via ~100+ authorized Channel Partners: State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs.
- Key schemes: Micro Finance Scheme (MFS up to ₹1.40L at 6.5%), Mahila Samriddhi Yojana (MSY at 6.0% for women), Term Loan Scheme (TLS up to ₹50L at 7.5%), Educational Loan Scheme (ELS up to ₹20L India / ₹30L Abroad at 6.5%), Green Business Scheme (GBS at 6.5%), Sanitation Entrepreneur Scheme (SRMS at 4-5% with up to ₹5L capital subsidy).
- Standard income ceiling: Annual family income up to ₹5.00 Lakhs p.a.
- The platform automatically checks channel partner health and NPAs to prevent applications getting stuck at non-disbursing branches.
- Anti-corruption stance: Emphasize that all government channel schemes are free of agent commissions. Warn against touts or middlemen.

Instructions for response:
1. Respond primarily in the requested language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : language === 'ta' ? 'Tamil (தமிழ்)' : language === 'te' ? 'Telugu (తెలుగు)' : language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
2. Keep the tone warm, empathetic, respectful, encouraging, and clear. Avoid bureaucratic jargon.
3. If discussing a scheme (${schemeName || 'general'}), specify:
   - Key eligibility criteria (SC category, income <= ₹5L)
   - Interest rate & repayment duration
   - How to approach the nearest Channel Partner (SCA or Lead Bank)
   - Required paperwork (Caste Certificate, Income Certificate, DPR / Estimate, Aadhaar)
4. Format using clean markdown with concise bullet points and bold highlights.
`;

    const prompt = `
User Question: "${query}"
Selected Scheme Context: ${schemeName ? schemeName : 'None specified'}
User Profile Context: ${userProfile ? JSON.stringify(userProfile) : 'None specified'}

Provide a clear, practical, and encouraging answer for the marginalized entrepreneur or student.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'I could not generate an answer at this moment. Please check your network or try again.';

    return NextResponse.json({
      text: reply,
      language,
    });
  } catch (error: any) {
    console.error('Error in Gemini Advisor API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate guidance',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
