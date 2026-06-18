import mongoose from "mongoose";

const GrantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    grantId: {
      type: String,
      unique: true,
      required: true,
    },

    grantType: {
      type: String,
      enum: [
        "SOVEREIGN_SME_GROWTH_GRANT",
        "GLOBAL_CIVIC_SOCIAL_INNOVATION_GRANT",
        "ENTERPRISE_TECH_SECURITY_ADVANCEMENTS_FUND",
        "REGIONAL_STABILIZATION_ECONOMIC_RECOVERY_GRANT",
      ],
      required: true,
    },

    grantTitle: {
      type: String,
      required: true,
    },

    businessName: {
      type: String,
      required: true,
    },

    federalTaxId: {
      type: String,
      required: true,
    },

    industrySector: {
      type: String,
      enum: [
        "TECHNOLOGY_PROTOCOLS",
        "FINANCIAL_SERVICES",
        "PUBLIC_INFRASTRUCTURE",
        "HEALTHCARE_WELLNESS",
        "RETAIL_DISTRIBUTION",
        "GENERAL_COMMERCE_OPERATIONS",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED"],
      default: "PENDING",
    },

    remarks: {
      type: String,
      default: "",
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    processedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Grant", GrantSchema);
