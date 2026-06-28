import mongoose from "mongoose";

const BillPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    billType: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
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

    reference: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export default mongoose.model("BillPayment", BillPaymentSchema);
