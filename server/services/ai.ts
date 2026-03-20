/**
 * AI Service
 * Handles AI-powered categorization and insight generation
 * Uses OpenAI API (or mock implementation for demo)
 * Features:
 * - Automatic expense categorization
 * - Monthly spending insights and summary
 * - Overspending predictions
 */

type ExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Other';

const CATEGORIES: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

/**
 * Categorize expense description using AI
 * In production, integrate with OpenAI API
 * For now, use keyword matching as fallback
 */
export async function categorizeExpense(
  description: string,
): Promise<ExpenseCategory> {
  try {
    // If OpenAI API is available, use it
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      return await categorizeWithOpenAI(description, apiKey);
    }
  } catch (error) {
    console.error('OpenAI API error, falling back to keyword matching:', error);
  }

  // Fallback: keyword-based categorization
  return categorizeWithKeywords(description);
}

/**
 * Categorize using OpenAI API
 */
async function categorizeWithOpenAI(
  description: string,
  apiKey: string,
): Promise<ExpenseCategory> {
  // Example implementation (uncomment to use with real API)
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Categorize this expense as one of: Food, Travel, Shopping, Bills, Other. Just respond with the category name.\n\nExpense: ${description}`,
      }],
      temperature: 0.3,
    }),
  });
  const data = await response.json();
  const category = data.choices[0]?.message?.content?.trim() as ExpenseCategory;
  return CATEGORIES.includes(category) ? category : 'Other';
  */
  
  // Mock response for demo
  return categorizeWithKeywords(description);
}

/**
 * Fallback keyword-based categorization
 */
function categorizeWithKeywords(description: string): ExpenseCategory {
  const lower = description.toLowerCase();

  // Food keywords
  if (/restaurant|food|lunch|dinner|breakfast|cafe|coffee|pizza|burger|steak|salad|grocery|groceries/i.test(lower)) {
    return 'Food';
  }

  // Travel keywords
  if (/uber|taxi|bus|train|flight|airline|hotel|gas|parking|car|travel|transit/i.test(lower)) {
    return 'Travel';
  }

  // Shopping keywords
  if (/shop|store|amazon|mall|clothes|shirt|pants|shoes|gift|retail|buy/i.test(lower)) {
    return 'Shopping';
  }

  // Bills keywords
  if (/bill|utility|electric|water|internet|phone|rent|mortgage|insurance|subscription|netflix|spotify/i.test(lower)) {
    return 'Bills';
  }

  return 'Other';
}

/**
 * Generate monthly spending insights
 */
export async function generateMonthlyInsights(
  expenses: Array<{ amount: number; category: ExpenseCategory; description: string; date: Date }>,
  monthlyBudget: number,
): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      return await generateInsightsWithOpenAI(expenses, monthlyBudget, apiKey);
    }
  } catch (error) {
    console.error('OpenAI API error, using fallback insights:', error);
  }

  // Fallback: generate basic insights
  return generateBasicInsights(expenses, monthlyBudget);
}

/**
 * Generate insights using OpenAI
 */
async function generateInsightsWithOpenAI(
  expenses: Array<{ amount: number; category: ExpenseCategory; description: string; date: Date }>,
  monthlyBudget: number,
  apiKey: string,
): Promise<string> {
  // Example implementation (uncomment to use with real API)
  /*
  const expenseData = expenses.map(e => ({
    category: e.category,
    amount: e.amount,
    description: e.description,
  }));
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Generate a brief, helpful monthly spending insight (2-3 sentences max) based on this expense data. Monthly budget: $${monthlyBudget}\n\nExpenses: ${JSON.stringify(expenseData)}`,
      }],
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0]?.message?.content || generateBasicInsights(expenses, monthlyBudget);
  */
  
  // Mock response for demo
  return generateBasicInsights(expenses, monthlyBudget);
}

/**
 * Generate basic insights without API
 */
function generateBasicInsights(
  expenses: Array<{ amount: number; category: ExpenseCategory }>,
  monthlyBudget: number,
): string {
  if (expenses.length === 0) {
    return `No expenses recorded yet. Start adding expenses to track your spending and stay within your $${monthlyBudget} monthly budget.`;
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percentUsed = ((totalSpent / monthlyBudget) * 100).toFixed(1);

  const categories = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<ExpenseCategory, number>,
  );

  const topCategoryEntry = Object.entries(categories).sort(([, a], [, b]) => b - a)[0];
  const topCategoryName = topCategoryEntry?.[0] || 'General';

  if (totalSpent > monthlyBudget) {
    return `You've exceeded your budget by $${(totalSpent - monthlyBudget).toFixed(2)} (${percentUsed}% of budget used). Consider reducing spending on ${topCategoryName}, your top expense category.`;
  }

  if (parseInt(percentUsed) > 70) {
    return `You're at ${percentUsed}% of your monthly budget. Slow down spending to stay within limits. ${topCategoryName} is your biggest expense category.`;
  }

  return `Great job! You're at ${percentUsed}% of your monthly budget. Continue monitoring ${topCategoryName} expenses as they account for the most spending.`;
}

/**
 * Detect overspending and generate warning
 */
export function checkBudgetAlert(
  currentSpending: number,
  monthlyBudget: number,
  alertThreshold: number = 80,
): { shouldAlert: boolean; message: string; percentageUsed: number } {
  const percentageUsed = (currentSpending / monthlyBudget) * 100;

  if (percentageUsed > alertThreshold) {
    return {
      shouldAlert: true,
      message: `⚠️ Budget Alert! You've used ${percentageUsed.toFixed(1)}% of your $${monthlyBudget} monthly budget. Remaining: $${(monthlyBudget - currentSpending).toFixed(2)}`,
      percentageUsed: percentageUsed,
    };
  }

  return {
    shouldAlert: false,
    message: '',
    percentageUsed,
  };
}
