# ExpenseTrack - AI-Powered Expense Tracker

A professional, production-ready expense tracking application with AI-powered categorization, budget management, and intelligent spending insights.

## Features

✨ **Core Features:**
- User authentication system (Sign up, Login, Logout) with JWT
- AI-powered expense categorization (Food, Travel, Shopping, Bills, Other)
- Monthly expense tracking with date-wise daily aggregation
- Real-time budget monitoring with overspending alerts
- AI-generated monthly spending insights and recommendations
- Responsive design for desktop and mobile
- Category-wise spending breakdown
- Overall statistics and analytics

## Project Structure

```
ExpenseTrack/
├── client/                          # React Frontend (SPA)
│   ├── pages/
│   │   ├── Login.jsx               # Authentication login page
│   │   ├── Signup.jsx              # User registration page
│   │   ├── Dashboard.jsx           # Main dashboard page
│   │   └── NotFound.tsx            # 404 page
│   ├── components/
│   │   ├── ExpenseForm.jsx         # Add/edit expense modal form
│   │   ├── ExpenseList.jsx         # Display list of expenses
│   │   ├── CategoryBreakdown.jsx   # Category spending breakdown
│   │   ├── BudgetTracker.jsx       # Budget status and alerts
│   │   └── InsightCard.jsx         # AI insights display
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state management
│   ├── services/
│   │   └── api.js                  # API service with authentication
│   ├── App.tsx                     # Main app component with routing
│   ├── global.css                  # Tailwind CSS config & theme
│   └── lib/utils.ts                # Utility functions
│
├── server/                          # Express Backend (API)
│   ├── models/
│   │   ├── User.ts                 # User data model
│   │   ├── Expense.ts              # Expense data model
│   │   └── Budget.ts               # Budget data model
│   ├── controllers/
│   │   ├── authController.ts       # Auth logic (signup, login)
│   │   └── expenseController.ts    # Expense CRUD operations
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication middleware
│   │   └── errorHandler.ts         # Global error handling
│   ├── services/
│   │   ├── db.ts                   # Database operations (mock)
│   │   └── ai.ts                   # AI categorization & insights
│   ├── utils/
│   │   └── jwt.ts                  # JWT token utilities
│   ├── routes/
│   │   └── demo.ts                 # Example routes
│   └── index.ts                    # Server setup & route configuration
│
├── shared/                          # Shared TypeScript types
│   └── api.ts                      # Shared API interfaces
│
├── tailwind.config.ts              # Tailwind CSS configuration
├── package.json                    # Dependencies & scripts
└── vite.config.ts                  # Vite bundler configuration
```

## API Endpoints

### Authentication
```
POST   /api/auth/signup              - Create new account
POST   /api/auth/login               - User login
GET    /api/auth/me                  - Get current user (requires auth)
PUT    /api/auth/update-budget       - Update monthly budget (requires auth)
```

### Expenses
```
POST   /api/expenses                 - Create new expense (requires auth)
GET    /api/expenses                 - Get all expenses or by month (requires auth)
GET    /api/expenses/monthly/:month  - Get monthly expenses with insights (requires auth)
GET    /api/expenses/daily           - Get daily expense totals (requires auth)
GET    /api/expenses/stats/overall   - Get overall statistics (requires auth)
PUT    /api/expenses/:id             - Update expense (requires auth)
DELETE /api/expenses/:id             - Delete expense (requires auth)
```

## Tech Stack

**Frontend:**
- React 18 with TypeScript/JSX
- React Router 6 (SPA)
- TailwindCSS 3
- Lucide React (icons)
- Vite bundler

**Backend:**
- Express 5
- Node.js
- JWT for authentication
- Crypto for password hashing

**Database:**
- Mock in-memory storage (ready for MongoDB)
- Structured models for Users, Expenses, Budgets

**AI Integration:**
- OpenAI API support (optional)
- Keyword-based categorization fallback
- AI-powered spending insights

## Getting Started

### 1. Installation
```bash
pnpm install
```

### 2. Development
```bash
pnpm dev
```
Server runs on http://localhost:8080

### 3. Building for Production
```bash
pnpm build
pnpm start
```

### 4. Testing
```bash
pnpm test
```

### 5. Type Checking
```bash
pnpm typecheck
```

## Usage Guide

### Creating an Account
1. Click "Sign up" on the login page
2. Enter email, password, name, and monthly budget
3. Account created and automatically logged in

### Adding Expenses
1. Click "Add New Expense" button
2. Enter amount, description, and date
3. Category auto-detects based on description (can be overridden)
4. Submit to save

### Viewing Dashboard
- Monthly breakdown of expenses
- Category-wise spending percentage
- Budget status with visual indicator
- AI-generated insights about spending habits
- Daily expense totals
- Overall statistics

### Budget Management
1. Click settings icon in header
2. Update monthly budget limit
3. Automatic alerts when spending exceeds threshold

## Authentication & Security

**Password Security:**
- Passwords hashed using Node.js crypto (scrypt)
- Never stored in plain text
- Salt included for additional security

**JWT Tokens:**
- Token stored in localStorage
- Attached to authenticated API requests
- 7-day expiration
- Includes userId and email

**API Protection:**
- All expense/budget endpoints require authentication
- Token verified before processing requests
- Proper error handling for invalid tokens

## AI Features

### Expense Categorization
- Automatic category detection from description
- Keyword-based fallback system
- Ready for OpenAI integration (set OPENAI_API_KEY)
- Categories: Food, Travel, Shopping, Bills, Other

### Spending Insights
- Monthly spending summary
- Budget status analysis
- Category-wise recommendations
- Overspending predictions and alerts
- Contextual tips based on spending patterns

## Database Schema

### Users
```json
{
  "_id": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "name": "string",
  "monthlyBudgetLimit": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Expenses
```json
{
  "_id": "string",
  "userId": "string (foreign key)",
  "amount": "number",
  "description": "string",
  "category": "Food | Travel | Shopping | Bills | Other",
  "date": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Budgets
```json
{
  "_id": "string",
  "userId": "string (foreign key)",
  "monthlyLimit": "number",
  "alertThreshold": "number (percentage)",
  "month": "YYYY-MM",
  "alertsSent": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Configuration

### Environment Variables
Create `.env` file:
```env
# JWT Secret (change in production)
JWT_SECRET=your-secret-key

# OpenAI API Key (optional, for AI features)
OPENAI_API_KEY=your-openai-api-key

# Node Environment
NODE_ENV=development
```

### MongoDB Integration
Currently using mock in-memory storage. To use MongoDB:

1. Install mongoose:
   ```bash
   pnpm add mongoose
   ```

2. Update `server/services/db.ts` with mongoose models

3. Add MongoDB connection string to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
   ```

## Deployment

### To Netlify
1. Connect repository via Netlify UI
2. Configure build command: `pnpm build`
3. Configure publish directory: `dist`
4. Set environment variables in Netlify dashboard
5. Deploy

### To Vercel
1. Connect repository via Vercel UI
2. Vercel auto-detects configuration
3. Set environment variables
4. Deploy

### Self-Hosted
```bash
pnpm build
pnpm start
```
Server listens on `process.env.PORT` or default port

## Theme Customization

Edit `client/global.css` to change colors:

```css
:root {
  --primary: 216 98% 52%;          /* Blue */
  --accent: 174 76% 48%;           /* Teal */
  --success: 142 71% 45%;          /* Green */
  --warning: 38 92% 50%;           /* Amber */
  --destructive: 0 84% 60%;        /* Red */
}
```

Color format: `hsl(hue saturation% lightness%)`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- CSS minification with TailwindCSS
- API request caching with React Query
- Responsive images and assets

## Error Handling

- Comprehensive error messages in UI
- API error handling with proper status codes
- Form validation on client and server
- Global error boundary ready to implement

## Future Enhancements

- [ ] Export expenses to CSV/PDF
- [ ] Recurring expense templates
- [ ] Multi-currency support
- [ ] Budget forecasting with ML
- [ ] Expense sharing with other users
- [ ] Mobile native app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Receipt photo capture
- [ ] Bank account integration
- [ ] Webhook integrations

## Support & Documentation

For detailed API documentation, see API endpoints section above.

For development questions, check the inline code comments throughout the project.

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ using React, Express, and AI**
