/**
 * Expense Model – Production Correct
 */

import mongoose, { Document, Types } from "mongoose";

/* ================================
   Input / DTO Type (used in app)
   ================================ */

export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Other";

export interface ExpenseInput {
  userId: string;          // string in app layer
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
}

/* ================================
   MongoDB Document Type
   ================================ */

export interface ExpenseDocument extends Document {
  userId: Types.ObjectId;  // ObjectId in DB
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

/* ================================
   Schema
   ================================ */

const expenseSchema = new mongoose.Schema<ExpenseDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Food", "Travel", "Shopping", "Bills", "Other"],
      required: true,
    },
    description: { type: String, trim: true },
    date: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model<ExpenseDocument>(
  "Expense",
  expenseSchema
);
