/**
 * Currency Selector Component
 * Allows users to select their preferred currency for displaying expenses
 */

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];

export function CurrencySelector({ 
  currentCurrency = 'USD',
  onCurrencyChange,
  isLoading = false 
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Select Currency
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => onCurrencyChange(currency.code)}
            disabled={isLoading}
            className={`p-3 rounded-lg font-medium text-sm transition border-2 ${
              currentCurrency === currency.code
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-bold text-lg">{currency.symbol}</div>
            <div className="text-xs font-semibold">{currency.code}</div>
            <div className="text-xs text-gray-600 hidden md:block">{currency.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CurrencySelector;
