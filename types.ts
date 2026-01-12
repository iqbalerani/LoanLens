
export enum Recommendation {
  APPROVE = 'APPROVE',
  DECLINE = 'DECLINE',
  CONDITIONAL = 'CONDITIONAL'
}

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

export enum FactorType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface RiskFactor {
  text: string;
  type: FactorType;
}

export interface PaymentPlanOption {
  term: string;
  monthlyAmount: number;
  risk: string;
}

export interface AffordabilityData {
  monthlyIncome: number;
  existingObligations: number;
  estimatedExpenses: number;
  availableForRepayment: number;
  paymentToAvailableRatio: number;
}

export interface RadarMetrics {
  documentIntegrity: number;
  employerVerification: number;
  affordability: number;
  incomeStability: number;
}

export interface AssessmentReport {
  id: string;
  timestamp: string;
  clientName: string;
  loanPurpose: string;
  amountRequested: number;
  repaymentPeriod: string;
  recommendation: Recommendation;
  riskLevel: RiskLevel;
  confidenceScore: number;
  verificationScore: number; // 0-100
  fraudFlags: string[];
  affordability: AffordabilityData;
  suggestedPaymentPlans: PaymentPlanOption[];
  riskFactors: RiskFactor[];
  aiReasoning: string;
  radarMetrics: RadarMetrics;
}

export interface LoanDetails {
  purpose: string;
  amount: number;
  period: string;
}

export interface LenderConfig {
  maxDtiRatio: number; // Max Debt-to-Income percentage
  minConfidence: number; // Min AI confidence for auto-approval
  strictEmploymentCheck: boolean;
  organizationName: string;
  branchName: string;
  authorizedSignatory: string;
}
