import Grant from "../models/grant";
import Transaction from "../models/transaction";
import AuthRepository from "../repositories/auth.repository";
import GrantRepository from "../repositories/grant.repository";
import { createNotification } from "./notification.service";
import { logActivity } from "./activityLog.service";
import { toObjectId } from "../utils/toObjectId";
import { CreateGrantInput } from "../types/grant.types";

const userRepository = new AuthRepository();
const grantRepository = new GrantRepository();

const grantProgramRules = {
  SOVEREIGN_SME_GROWTH_GRANT: {
    title: "Sovereign SME Growth Grant",
    min: 15000,
    max: 75000,
  },
  GLOBAL_CIVIC_SOCIAL_INNOVATION_GRANT: {
    title: "Global Civic & Social Innovation Grant",
    min: 10000,
    max: 50000,
  },
  ENTERPRISE_TECH_SECURITY_ADVANCEMENTS_FUND: {
    title: "Enterprise Tech & Security Advancements Fund",
    min: 25000,
    max: 150000,
  },
  REGIONAL_STABILIZATION_ECONOMIC_RECOVERY_GRANT: {
    title: "Regional Stabilization & Economic Recovery Grant",
    min: 5000,
    max: 30000,
  },
};

const industrySectors = [
  "TECHNOLOGY_PROTOCOLS",
  "FINANCIAL_SERVICES",
  "PUBLIC_INFRASTRUCTURE",
  "HEALTHCARE_WELLNESS",
  "RETAIL_DISTRIBUTION",
  "GENERAL_COMMERCE_OPERATIONS",
];

const getGrantProgramRule = (grantType: string) => {
  const rule = grantProgramRules[grantType as keyof typeof grantProgramRules];
  if (!rule) {
    throw new Error(
      `Invalid grant type: ${grantType}. Select a valid grant program.`,
    );
  }

  return rule;
};

const assertValidIndustrySector = (industrySector: string) => {
  if (!industrySectors.includes(industrySector)) {
    throw new Error(
      `Invalid industry sector: ${industrySector}. Select a valid industry sector.`,
    );
  }
};

const assertValidGrantAmount = (grantType: string, amount: number) => {
  const rule = getGrantProgramRule(grantType);

  if (amount < rule.min || amount > rule.max) {
    throw new Error(
      `Grant amount must be between ${rule.min} and ${rule.max} for ${rule.title}.`,
    );
  }
};

const generateGrantReference = (): string => `GRANT-${Date.now()}`;
const generateTransactionId = (): string => `TNX-${Date.now()}`;
const generateTransactionReference = (): string => `REF-${Date.now()}`;

export const getAllGrants = async () => {
  return Grant.find({});
};

export const getUserGrants = async (userId: string) => {
  return Grant.find({ userId });
};

export const getGrantById = async (grantId: string) => {
  const grant = await grantRepository.findOne({ grantId });

  if (!grant) {
    throw new Error("Grant not found");
  }

  return grant;
};

export const createGrant = async (userId: string, input: CreateGrantInput) => {
  assertValidIndustrySector(input.industrySector);
  assertValidGrantAmount(input.grantType, input.amount);

  const programRule = getGrantProgramRule(input.grantType);

  const grant = await Grant.create({
    userId: toObjectId(userId),
    grantId: generateGrantReference(),
    grantType: input.grantType,
    grantTitle: programRule.title,
    businessName: input.businessName,
    federalTaxId: input.federalTaxId,
    industrySector: input.industrySector,
    amount: input.amount,
    purpose: input.purpose,
    status: "PENDING",
  });

  await createNotification(
    userId,
    "Grant Application Submitted",
    `Your ${programRule.title} application for ${input.amount} is pending review.`,
    "INFO",
  );

  await logActivity(
    userId,
    "Submitted grant application",
    "",
    `grantId=${grant.grantId}`,
  );

  return grant;
};

export const reviewGrant = async (grantId: string, adminId: string) => {
  const grant = await getGrantById(grantId);

  if (grant.status !== "PENDING") {
    throw new Error("Grant application cannot be marked as under review.");
  }

  const updatedGrant = await grantRepository.update(
    { grantId },
    {
      status: "UNDER_REVIEW",
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  await createNotification(
    grant.userId.toString(),
    "Grant Under Review",
    `Your grant application for ${grant.grantTitle} is now under review.`,
    "INFO",
  );

  await logActivity(
    adminId,
    "Marked grant under review",
    `grantStatus=${grant.status}`,
    `grantStatus=UNDER_REVIEW`,
  );

  return updatedGrant;
};

export const approveGrant = async (grantId: string, adminId: string) => {
  const grant = await getGrantById(grantId);

  if (grant.status !== "PENDING" && grant.status !== "UNDER_REVIEW") {
    throw new Error("Grant application cannot be approved.");
  }

  const updatedGrant = await grantRepository.update(
    { grantId },
    {
      status: "APPROVED",
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  await createNotification(
    grant.userId.toString(),
    "Grant Approved",
    `Your grant application for ${grant.grantTitle} has been approved and awaits disbursement.`,
    "SUCCESS",
  );

  await logActivity(
    adminId,
    "Approved grant application",
    `grantStatus=${grant.status}`,
    `grantStatus=APPROVED`,
  );

  return updatedGrant;
};

export const rejectGrant = async (
  grantId: string,
  remarks: string | undefined,
  adminId: string,
) => {
  const grant = await getGrantById(grantId);

  if (grant.status !== "PENDING" && grant.status !== "UNDER_REVIEW") {
    throw new Error("Grant application cannot be rejected.");
  }

  const updatedGrant = await grantRepository.update(
    { grantId },
    {
      status: "REJECTED",
      remarks: remarks || "",
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  await createNotification(
    grant.userId.toString(),
    "Grant Application Rejected",
    `Your grant application for ${grant.grantTitle} has been rejected.${remarks ? ` Reason: ${remarks}` : ""}`,
    "ERROR",
  );

  await logActivity(
    adminId,
    "Rejected grant application",
    `grantStatus=${grant.status}`,
    `grantStatus=REJECTED, remarks=${remarks || "none"}`,
  );

  return updatedGrant;
};

export const disburseGrant = async (grantId: string, adminId: string) => {
  const grant = await getGrantById(grantId);

  if (grant.status !== "APPROVED") {
    throw new Error("Only approved grants can be disbursed.");
  }

  const updatedGrant = await grantRepository.update(
    { grantId },
    {
      status: "DISBURSED",
      processedBy: toObjectId(adminId),
      processedAt: new Date(),
    },
  );

  await userRepository.update(
    { _id: grant.userId },
    {
      $inc: {
        totalBalance: grant.amount,
      },
    },
  );

  await Transaction.create({
    userId: grant.userId,
    transactionId: generateTransactionId(),
    transactionType: "ADMIN_CREDIT",
    amount: grant.amount,
    currency: "USD",
    reference: generateTransactionReference(),
    status: "COMPLETED",
    direction: "CREDIT",
    description: `Disbursed grant ${grant.grantTitle}`,
    processedBy: toObjectId(adminId),
    processedAt: new Date(),
    createdBy: toObjectId(adminId),
  });

  await createNotification(
    grant.userId.toString(),
    "Grant Disbursed",
    `Your grant of ${grant.amount} has been disbursed to your account.`,
    "SUCCESS",
  );

  await logActivity(
    adminId,
    "Disbursed grant funds",
    `grantStatus=${grant.status}`,
    `grantStatus=DISBURSED`,
  );

  return updatedGrant;
};
