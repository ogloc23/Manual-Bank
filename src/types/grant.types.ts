export type GrantType =
  | "SOVEREIGN_SME_GROWTH_GRANT"
  | "GLOBAL_CIVIC_SOCIAL_INNOVATION_GRANT"
  | "ENTERPRISE_TECH_SECURITY_ADVANCEMENTS_FUND"
  | "REGIONAL_STABILIZATION_ECONOMIC_RECOVERY_GRANT";

export type IndustrySector =
  | "TECHNOLOGY_PROTOCOLS"
  | "FINANCIAL_SERVICES"
  | "PUBLIC_INFRASTRUCTURE"
  | "HEALTHCARE_WELLNESS"
  | "RETAIL_DISTRIBUTION"
  | "GENERAL_COMMERCE_OPERATIONS";

export interface CreateGrantInput {
  grantType: GrantType;
  businessName: string;
  federalTaxId: string;
  industrySector: IndustrySector;
  amount: number;
  purpose: string;
}

export interface ApproveGrantInput {
  grantId: string;
}

export interface RejectGrantInput {
  grantId: string;
  remarks?: string;
}

export interface DisburseGrantInput {
  grantId: string;
}
