import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    identityType: {
      type: String,
      required: true,
    },

    identityNumber: {
      type: String,
      required: true,
    },

    identityDocument: {
      type: String,
      required: true,
    },

    selfieImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Verification", VerificationSchema);