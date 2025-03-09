import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CreditCard, Plus, DollarSign, Tag, FileText, Calendar } from 'lucide-react';

// Common expense categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Rent/Mortgage',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health & Medical',
  'Travel',
  'Education',
  'Personal Care',
  'Gifts & Donations',
  'Bills & Payments',
  'Investments',
  'Other'
];

// Common income categories
const INCOME_CATEGORIES = [
  'Salary/Wages',
  'Freelance/Contract',
  'Business Income',
  'Investments',
  'Gifts',
  'Refunds',
  'Other'
];

const TransactionEntry = ({ accounts = [], setAccounts }) => {
  const [transaction, setTransaction] = useState({
    accountId: accounts.length > 0 ? accounts[0].id : '',
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Ensure we have a valid account selected if accounts change
  useEffect(() => {
    if (accounts.length > 0 && !accounts.some(acc => acc.id === transaction.accountId)) {
      setTransaction(prev => ({
        ...prev,
        accountId: accounts[0].id
      }));
    }
  }, [accounts]);

  const validateForm = () => {
    const errors = {};
    
    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!transaction.category) {
      errors.category = 'Please select or enter a category';
    }
    
    if (!transaction.date) {
      errors.date = 'Please enter a date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTransactionSubmit = () => {
    if (!validateForm() || accounts.length === 0) return;

    const finalCategory = showCustomCategory ? customCategory : transaction.category;

    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === transaction.accountId
          ? { 
              ...account, 
              balance: transaction.type === 'expense'
                ? account.balance - parseFloat(transaction.amount)
                : account.balance + parseFloat(transaction.amount),
              transactions: [
                ...account.transactions,
                {
                  id: Date.now(),
                  type: transaction.type,
                  amount: parseFloat(transaction.amount),
                  category: finalCategory,
                  description: transaction.description,
                  date: new Date(transaction.date).toISOString()
                }
              ]
            }
          : account
      )
    );

    // Reset form
    setTransaction({
      accountId: accounts.length > 0 ? accounts[0].id : '',
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowCustomCategory(false);
    setCustomCategory('');
    setFormErrors({});
  };

  // Get appropriate categories based on transaction type
  const categories = transaction.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Render nothing if no accounts
  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please add an account first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2" /> Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Account Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Account</label>
            <select
              value={transaction.accountId}
              onChange={(e) => setTransaction(prev => ({
                ...prev,
                accountId: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} (${account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTransaction(prev => ({ ...prev, type: 'expense', category: '' }))}
              className={`p-2 border rounded flex items-center justify-center ${
                transaction.type === 'expense'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setTransaction(prev => ({ ...prev, type: 'income', category: '' }))}
              className={`p-2 border rounded flex items-center justify-center ${
                transaction.type === 'income'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">Income</span>
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="number"
                placeholder="0.00"
                value={transaction.amount}
                onChange={(e) => setTransaction(prev => ({
                  ...prev,
                  amount: e.target.value
                }))}
                className={`w-full pl-10 p-2 border rounded focus:ring-2 focus:outline-none ${
                  formErrors.amount 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {formErrors.amount && (
              <p className="text-sm text-red-600 mt-1">{formErrors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              
              {!showCustomCategory ? (
                <>
                  <select
                    value={transaction.category}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomCategory(true);
                      } else {
                        setTransaction(prev => ({
                          ...prev,
                          category: e.target.value
                        }));
                      }
                    }}
                    className={`w-full pl-10 p-2 border rounded focus:ring-2 focus:outline-none ${
                      formErrors.category 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="custom">+ Custom Category</option>
                  </select>
                </>
              ) : (
                <div className="flex">
                  <input 
                    type="text"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`w-full pl-10 p-2 border rounded-l focus:ring-2 focus:outline-none ${
                      formErrors.category 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(false)}
                    className="px-3 py-2 border-t border-r border-b border-gray-300 rounded-r bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {formErrors.category && (
              <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="date"
                value={transaction.date}
                onChange={(e) => setTransaction(prev => ({
                  ...prev,
                  date: e.target.value
                }))}
                className={`w-full pl-10 p-2 border rounded focus:ring-2 focus:outline-none ${
                  formErrors.date 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            {formErrors.date && (
              <p className="text-sm text-red-600 mt-1">{formErrors.date}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text"
                placeholder="e.g., Grocery shopping at Walmart"
                value={transaction.description}
                onChange={(e) => setTransaction(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleTransactionSubmit}
            className={`w-full flex items-center justify-center ${
              transaction.type === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={accounts.length === 0}
          >
            <Plus className="mr-1 h-5 w-5" />
            Add {transaction.type === 'expense' ? 'Expense' : 'Income'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionEntry;
