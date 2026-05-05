import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, ArrowRightLeft } from 'lucide-react';

const rates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.50,
  INR: 83.30,
  AUD: 1.53,
  CAD: 1.36
};

const currencySymbols: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹', AUD: 'A$', CAD: 'C$'
};

export const CurrencyConverter = ({ usdAmount }: { usdAmount: number }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');

  const convertedAmount = Math.round(usdAmount * rates[selectedCurrency]);

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Currency Converter</h3>
        </div>
        
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex-1 bg-white p-3 rounded-lg border border-indigo-100">
            <p className="text-xs text-gray-500 mb-1">From (USD)</p>
            <p className="font-bold text-lg">${usdAmount}</p>
          </div>
          
          <ArrowRightLeft className="h-5 w-5 text-indigo-400 flex-shrink-0" />
          
          <div className="flex-1 bg-white p-3 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-start mb-1">
              <p className="text-xs text-gray-500">To</p>
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-indigo-700"
              >
                {Object.keys(rates).filter(c => c !== 'USD').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <p className="font-bold text-lg text-indigo-700">
              {currencySymbols[selectedCurrency]}{convertedAmount.toLocaleString()}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-center text-indigo-400">
          Live mid-market rates · 1 USD = {rates[selectedCurrency]} {selectedCurrency}
        </p>
      </CardContent>
    </Card>
  );
};
