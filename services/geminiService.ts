
import { AssessmentReport, Recommendation, RiskLevel, FactorType, LenderConfig } from "../types";

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Validate API key on module load
if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY is not defined. Please set it in your .env file.");
}

// Helper function to call OpenRouter API
async function callOpenRouter(
  messages: any[],
  model: string,
  responseSchema?: any
): Promise<string> {
  // Check API key before making request
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your .env file.");
  }

  console.log("Making OpenRouter API request with model:", model);
  const requestBody: any = {
    model: model,
    messages: messages,
  };

  // Add structured output if schema is provided
  if (responseSchema) {
    requestBody.response_format = {
      type: "json_schema",
      json_schema: {
        name: "assessment_report",
        strict: true,
        schema: responseSchema
      }
    };
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "https://loanlens.app",
      "X-Title": "LoanLens"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", response.status, errorText);
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("OpenRouter API response received successfully");

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected API response format:", data);
    throw new Error("Unexpected response format from OpenRouter API");
  }

  return data.choices[0].message.content;
}

export const analyzeLoanDocument = async (
  base64Data: string,
  mimeType: string,
  loanDetails: { purpose: string; amount: number; period: string },
  config: LenderConfig
): Promise<AssessmentReport> => {
  console.log("Starting loan document analysis...");
  // Use the configured model or default to gemini-2.5-flash
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  console.log("Using model:", model);

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

  // Convert schema from Google's Type format to JSON Schema format
  const responseSchema = {
    type: "object",
    properties: {
      clientName: { type: "string" },
      loanPurpose: { type: "string" },
      amountRequested: { type: "number" },
      repaymentPeriod: { type: "string" },
      recommendation: {
        type: "string",
        enum: Object.values(Recommendation)
      },
      riskLevel: {
        type: "string",
        enum: Object.values(RiskLevel)
      },
      confidenceScore: { type: "number" },
      verificationScore: { type: "number" },
      fraudFlags: {
        type: "array",
        items: { type: "string" }
      },
      radarMetrics: {
        type: "object",
        properties: {
          documentIntegrity: { type: "number" },
          employerVerification: { type: "number" },
          affordability: { type: "number" },
          incomeStability: { type: "number" }
        },
        required: ["documentIntegrity", "employerVerification", "affordability", "incomeStability"],
        additionalProperties: false
      },
      affordability: {
        type: "object",
        properties: {
          monthlyIncome: { type: "number" },
          existingObligations: { type: "number" },
          estimatedExpenses: { type: "number" },
          availableForRepayment: { type: "number" },
          paymentToAvailableRatio: { type: "number" }
        },
        required: ["monthlyIncome", "existingObligations", "estimatedExpenses", "availableForRepayment", "paymentToAvailableRatio"],
        additionalProperties: false
      },
      suggestedPaymentPlans: {
        type: "array",
        items: {
          type: "object",
          properties: {
            term: { type: "string" },
            monthlyAmount: { type: "number" },
            risk: { type: "string" }
          },
          required: ["term", "monthlyAmount", "risk"],
          additionalProperties: false
        }
      },
      riskFactors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: { type: "string" },
            type: {
              type: "string",
              enum: Object.values(FactorType)
            }
          },
          required: ["text", "type"],
          additionalProperties: false
        }
      },
      aiReasoning: { type: "string" }
    },
    required: [
      "clientName", "loanPurpose", "amountRequested", "repaymentPeriod",
      "recommendation", "riskLevel", "confidenceScore", "verificationScore",
      "fraudFlags", "affordability", "suggestedPaymentPlans", "riskFactors",
      "aiReasoning", "radarMetrics"
    ],
    additionalProperties: false
  };

  try {
    // Format the image as a data URI for OpenRouter
    const imageDataUri = `data:${mimeType};base64,${base64Data}`;
    console.log("Image formatted as data URI, MIME type:", mimeType);

    // Construct messages in OpenAI format with multimodal content
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUri
            }
          }
        ]
      }
    ];

    console.log("Calling OpenRouter API...");
    const responseText = await callOpenRouter(messages, model, responseSchema);
    console.log("Parsing response...");
    const parsed = JSON.parse(responseText);

    const result = {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    console.log("Analysis completed successfully");
    return result;
  } catch (error: any) {
    console.error("OpenRouter Underwriting Error:", error);
    console.error("Error details:", error.message, error.stack);
    throw new Error(error.message || "Analysis failed. Document may be unreadable or corrupt.");
  }
};

export const generateDecisionLetter = async (report: AssessmentReport, config: LenderConfig): Promise<string> => {
  console.log("Generating decision letter...");
  // Use a faster/cheaper model for letter generation
  const model = "google/gemini-2.5-flash";

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
    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    const responseText = await callOpenRouter(messages, model);
    console.log("Decision letter generated successfully");
    return responseText || "Failed to generate letter text.";
  } catch (error: any) {
    console.error("Decision Letter Generation Error:", error);
    console.error("Error details:", error.message);
    return "Error generating formal decision letter. Please review assessment manually.";
  }
};
