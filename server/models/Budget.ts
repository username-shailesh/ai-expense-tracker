/**
 * Budget Model – Production Correct
 */

import mongoose, { Document, Types } from "mongoose";

/* ================================
   Input / DTO Type
   ================================ */

export interface BudgetInput {
  userId: string;        // app layer
  month: string;         // YYYY-MM
  monthlyLimit: number;
  alertThreshold: number;
  alertsSent: boolean;
}

/* ================================
   MongoDB Document Type
   ================================ */

export interface BudgetDocument extends Document {
  userId: Types.ObjectId;
  month: string;
  monthlyLimit: number;
  alertThreshold: number;
  alertsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ================================
   Schema
   ================================ */

const budgetSchema = new mongoose.Schema<BudgetDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
      index: true,
    },
    monthlyLimit: { type: Number, required: true, min: 0 },
    alertThreshold: { type: Number, default: 80, min: 1, max: 100 },
    alertsSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export const BudgetModel = mongoose.model<BudgetDocument>(
  "Budget",
  budgetSchema
);
