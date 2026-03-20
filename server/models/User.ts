/**
 * User Model
 * MongoDB schema + TypeScript interface
 */

import mongoose, { Document } from "mongoose";

/**
 * TypeScript User interface (used across app)
 */
export interface User {
  email: string;
  password: string;
  name?: string;
  monthlyBudgetLimit?: number;
  currency?: string;
  currencySymbol?: string;
}

/**
 * MongoDB Document type
 */
export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema
 */
const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    monthlyBudgetLimit: { type: Number, default: 5000 },
    currency: { type: String, default: "USD" },
    currencySymbol: { type: String, default: "$" },
  },
  { timestamps: true }
);

/**
 * MongoDB Model
 */
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
