import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    loanAmount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      default: 0,
    },

    durationMonths: {
      type: Number,
      required: true,
    },

    repaymentStatus: {
      type: String,
      enum: ["PENDING", "ACTIVE", "COMPLETED", "DEFAULTED"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: ["UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "UNDER_REVIEW",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Loan", LoanSchema);