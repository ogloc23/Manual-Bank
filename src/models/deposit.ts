import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    paymentMethod: {
      type: String,
      default: "BANK_TRANSFER",
    },

    proofOfPayment: {
      type: String,
      default: "",
    },

    reference: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "APPROVED", "DECLINED"],
      default: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Deposit", DepositSchema);
