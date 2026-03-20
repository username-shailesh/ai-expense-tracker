import mongoose from "mongoose";

// User
import { User, UserModel } from "../models/User";

// Expense
import {
  ExpenseInput,
  ExpenseDocument,
  ExpenseModel,
} from "../models/Expense";

// Budget
import {
  BudgetInput,
  BudgetDocument,
  BudgetModel,
} from "../models/Budget";

/* =====================================================
   USER DATABASE (MongoDB)
   ===================================================== */

export const UserDB = {
  async create(user: User) {
    return await UserModel.create(user);
  },

  async findById(id: string) {
    return await UserModel.findById(id);
  },

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },

  async update(id: string, updates: Partial<User>) {
    return await UserModel.findByIdAndUpdate(id, updates, { new: true });
  },
};

/* =====================================================
   EXPENSE DATABASE (MongoDB)
   ===================================================== */

export const ExpenseDB = {
  async create(input: ExpenseInput): Promise<ExpenseDocument> {
    return await ExpenseModel.create({
      ...input,
      userId: new mongoose.Types.ObjectId(input.userId),
    });
  },

  async findByUserId(userId: string): Promise<ExpenseDocument[]> {
    return await ExpenseModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ date: -1 });
  },

  async findByUserIdAndMonth(
    userId: string,
    month: string
  ): Promise<ExpenseDocument[]> {
    const [year, monthNum] = month.split("-").map(Number);

    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0, 23, 59, 59);

    return await ExpenseModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });
  },

  async update(
    id: string,
    updates: Partial<ExpenseInput>
  ): Promise<ExpenseDocument | null> {
    return await ExpenseModel.findByIdAndUpdate(id, updates, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    const result = await ExpenseModel.findByIdAndDelete(id);
    return !!result;
  },

  /* =====================================================
     MONTH ARCHIVE (ONLY ADDITION – SAFE FIX)
     ===================================================== */
  async findMonthsArchive(userId: string) {
    return await ExpenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          year: "$_id.year",
          total: 1,
          count: 1,
        },
      },
      {
        $sort: { year: -1, month: -1 },
      },
    ]);
  },
};

/* =====================================================
   BUDGET DATABASE (MongoDB)
   ===================================================== */

export const BudgetDB = {
  async upsert(input: BudgetInput): Promise<BudgetDocument> {
    return await BudgetModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(input.userId),
        month: input.month,
      },
      {
        $set: {
          monthlyLimit: input.monthlyLimit,
          alertThreshold: input.alertThreshold,
          alertsSent: input.alertsSent,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  },

  async findByUserIdAndMonth(
    userId: string,
    month: string
  ): Promise<BudgetDocument | null> {
    return await BudgetModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      month,
    });
  },
};

/* =====================================================
   DATABASE INITIALIZATION
   ===================================================== */

export async function initializeDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI not found in environment variables");
  }

  await mongoose.connect(uri);
  console.log("✅ MongoDB Atlas Connected Successfully");
}
