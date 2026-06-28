import mongoose from "mongoose";

const WireTransferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    beneficiaryName: {
      type: String,
      required: true,
    },

    beneficiaryBank: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    swiftCode: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["PRIMARY_ACCOUNT", "SECONDARY_ACCOUNT", "TERTIARY_ACCOUNT"],
      default: "PRIMARY_ACCOUNT",
    },

    fee: {
      type: Number,
      default: 0,
    },

    reason: {
      type: String,
      default: "",
    },

    reference: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "UNDER_REVIEW",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "REJECTED",
      ],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export default mongoose.model("WireTransfer", WireTransferSchema);
