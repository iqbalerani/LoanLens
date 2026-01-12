
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentReport, Recommendation, RiskLevel, FactorType, LenderConfig } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLoanDocument = async (
  base64Data: string,
  mimeType: string,
  loanDetails: { purpose: string; amount: number; period: string },
  config: LenderConfig
): Promise<AssessmentReport> => {
  // Use gemini-3-pro-preview for advanced reasoning and financial analysis tasks.
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    ACT AS A SENIOR UNDERWRITER. Analyze the attached financial document for a micro-loan application.
    
    LENDER PARAMETERS:
    - Maximum Debt-to-Income (DTI) allowed: ${config.maxDtiRatio}%
    - Minimum AI Confidence required: ${config.minConfidence}%
    - Strict Employment Stability Check: ${config.strictEmploymentCheck ? 'ON' : 'OFF'}

    LOAN CONTEXT:
    - Purpose: ${loanDetails.purpose}
    - Amount: $${loanDetails.amount}
    - Term: ${loanDetails.period}
    
    CRITICAL TASKS:
    1. EXTRACT: Client name and exact monthly income.
    2. FRAUD DETECTION: Look for inconsistent font sizes, suspicious rounding (e.g. exactly $5,000.00 every time), or lack of standard tax deductions.
    3. AFFORDABILITY: Calculate DTI. Compare against lender's ${config.maxDtiRatio}% limit.
    4. VERIFICATION SCORE: Assign 0-100 based on document clarity and data consistency.
    5. MULTI-DIMENSIONAL RISK: Score 0-100 for Document Integrity, Employer Verification, Affordability, and Income Stability.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      clientName: { type: Type.STRING },
      loanPurpose: { type: Type.STRING },
      amountRequested: { type: Type.NUMBER },
      repaymentPeriod: { type: Type.STRING },
      recommendation: { type: Type.STRING, enum: Object.values(Recommendation) },
      riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
      confidenceScore: { type: Type.NUMBER },
      verificationScore: { type: Type.NUMBER },
      fraudFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
      radarMetrics: {
        type: Type.OBJECT,
        properties: {
          documentIntegrity: { type: Type.NUMBER },
          employerVerification: { type: Type.NUMBER },
          affordability: { type: Type.NUMBER },
          incomeStability: { type: Type.NUMBER }
        },
        required: ["documentIntegrity", "employerVerification", "affordability", "incomeStability"]
      },
      affordability: {
        type: Type.OBJECT,
        properties: {
          monthlyIncome: { type: Type.NUMBER },
          existingObligations: { type: Type.NUMBER },
          estimatedExpenses: { type: Type.NUMBER },
          availableForRepayment: { type: Type.NUMBER },
          paymentToAvailableRatio: { type: Type.NUMBER }
        },
        required: ["monthlyIncome", "existingObligations", "estimatedExpenses", "availableForRepayment", "paymentToAvailableRatio"]
      },
      suggestedPaymentPlans: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            monthlyAmount: { type: Type.NUMBER },
            risk: { type: Type.STRING }
          },
          required: ["term", "monthlyAmount", "risk"]
        }
      },
      riskFactors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING, enum: Object.values(FactorType) }
          },
          required: ["text", "type"]
        }
      },
      aiReasoning: { type: Type.STRING }
    },
    required: [
      "clientName", "loanPurpose", "amountRequested", "repaymentPeriod", 
      "recommendation", "riskLevel", "confidenceScore", "verificationScore", "fraudFlags", "affordability", 
      "suggestedPaymentPlans", "riskFactors", "aiReasoning", "radarMetrics"
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini Underwriting Error:", error);
    throw new Error("Analysis failed. Document may be unreadable or corrupt.");
  }
};

export const generateDecisionLetter = async (report: AssessmentReport, config: LenderConfig): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    ACT AS A SENIOR COMPLIANCE OFFICER AT ${config.organizationName.toUpperCase()} (${config.branchName.toUpperCase()} BRANCH). 
    Generate a formal Decision Letter for a loan application.
    
    CLIENT DATA:
    - Name: ${report.clientName}
    - Amount: $${report.amountRequested}
    - Purpose: ${report.loanPurpose}
    - Recommendation: ${report.recommendation}
    - Key Reason: ${report.aiReasoning}
    - Authorized Signatory: ${config.authorizedSignatory}

    REQUIREMENTS:
    1. Professional, formal, and neutral tone.
    2. Compliance-focused wording.
    3. CLEAR status (Approved or Declined).
    4. If Declined, provide a clear but concise reason without being emotional.
    5. Mention the issuing branch: ${config.branchName}.
    6. Include the authorized signatory name: ${config.authorizedSignatory}.
    7. Include placeholders for Date.
    8. Output the letter text in Markdown format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Failed to generate letter text.";
  } catch (error) {
    console.error("Decision Letter Generation Error:", error);
    return "Error generating formal decision letter. Please review assessment manually.";
  }
};
