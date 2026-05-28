import mongoose from "mongoose";

const CharitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      default: "",
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

export default mongoose.model("Charity", CharitySchema);