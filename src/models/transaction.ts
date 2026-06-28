import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionId: {
      type: String,
      unique: true,
      required: true,
    },

    transactionType: {
      type: String,
      enum: [
        "DEPOSIT",
        "WITHDRAWAL",
        "WIRE_TRANSFER",
        "CHARITY",
        "LOAN",
        "BILL_PAYMENT",
        "ADMIN_CREDIT",
        "ADMIN_DEBIT",
      ],
      required: true,
    },

    accountType: {
      type: String,
      enum: ["PRIMARY_ACCOUNT", "SECONDARY_ACCOUNT", "TERTIARY_ACCOUNT"],
      default: "PRIMARY_ACCOUNT",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    reference: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REJECTED"],
      default: "PENDING",
    },

    direction: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    description: {
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

    fee: {
      type: Number,
      default: 0,
    },

    recipientName: {
      type: String,
      default: "",
    },

    recipientBank: {
      type: String,
      default: "",
    },

    recipientAccountNumber: {
      type: String,
      default: "",
    },

    proofOfPayment: {
      type: String,
      default: "",
    },

    paymentLinkUsed: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", TransactionSchema);
