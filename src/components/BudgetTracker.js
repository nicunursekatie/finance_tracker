import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { PieChart, Trash2, AlertTriangle, Plus, DollarSign } from 'lucide-react';

// Common budget categories (same as expense categories for consistency)
const BUDGET_CATEGORIES = [
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

const BudgetTracker = ({ budgets, setBudgets, accounts }) => {
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: ''
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [spendingByCategory, setSpendingByCategory] = useState({});

  // Calculate spending by category based on all transactions
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;

    const spending = {};
    
    // Get all expense transactions from all accounts
    const expenseTransactions = accounts.flatMap(account => 
      account.transactions.filter(t => t.type === 'expense')
    );
    
    // Sum up spending by category
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!spending[category]) {
        spending[category] = 0;
      }
      spending[category] += transaction.amount;
    });
    
    setSpendingByCategory(spending);
    
    // Update budget spent amounts
    setBudgets(currentBudgets => 
      currentBudgets.map(budget => ({
        ...budget,
        spent: spending[budget.category] || 0
      }))
    );
  }, [accounts, setBudgets]);

  const validateForm = () => {
    const errors = {};
    
    if (!newBudget.category && !customCategory) {
      errors.category = 'Please select or enter a category';
    }
    
    if (!newBudget.limit || parseFloat(newBudget.limit) <= 0) {
      errors.limit = 'Please enter a valid amount';
    }
    
    // Check if category already exists
    const finalCategory = showCustomCategory ? customCategory : newBudget.category;
    const categoryExists = budgets.some(budget => budget.category === finalCategory);
    
    if (categoryExists) {
      errors.category = 'This category already has a budget';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddBudget = () => {
    if (!validateForm()) return;

    const finalCategory = showCustomCategory ? customCategory : newBudget.category;
    
    setBudgets(prev => [
      ...prev,
      {
        category: finalCategory,
        limit: parseFloat(newBudget.limit),
        spent: spendingByCategory[finalCategory] || 0
      }
    ]);

    // Reset form
    setNewBudget({ category: '', limit: '' });
    setShowCustomCategory(false);
    setCustomCategory('');
    setFormErrors({});
  };

  const handleDeleteBudget = (categoryToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the budget for ${categoryToDelete}?`);
    if (confirmDelete) {
      setBudgets(prev => prev.filter(budget => budget.category !== categoryToDelete));
    }
  };

  // Get a list of categories that don't have budgets yet
  const availableCategories = BUDGET_CATEGORIES.filter(
    category => !budgets.some(budget => budget.category === category)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2" /> Budget Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Existing Budget Categories */}
        <div className="space-y-4 mb-6">
          {budgets.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No budgets set. Add your first budget below.</p>
          ) : (
            budgets.map(budget => {
              const percentUsed = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
              const isOverBudget = percentUsed > 100;
              const isNearLimit = percentUsed >= 80 && percentUsed <= 100;
              
              return (
                <div key={budget.category} className="border rounded-lg p-3 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{budget.category}</h4>
                      <p className="text-sm text-gray-500">
                        {isOverBudget && (
                          <span className="flex items-center text-red-500">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Over budget!
                          </span>
                        )}
                        {isNearLimit && !isOverBudget && (
                          <span className="flex items-center text-yellow-500">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Approaching limit
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentUsed.toFixed(0)}% used
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.category)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isOverBudget
                          ? 'bg-red-500'
                          : isNearLimit
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(percentUsed, 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Budget Category */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Add New Budget</h3>
          <div className="space-y-3">
            {/* Category Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              
              {!showCustomCategory ? (
                <>
                  <select
                    value={newBudget.category}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomCategory(true);
                      } else {
                        setNewBudget(prev => ({
                          ...prev,
                          category: e.target.value
                        }));
                      }
                    }}
                    className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${
                      formErrors.category 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map(category => (
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
                    className={`w-full p-2 border rounded-l focus:ring-2 focus:outline-none ${
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
              {formErrors.category && (
                <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>
              )}
            </div>
            
            {/* Monthly Limit */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Monthly Limit</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget(prev => ({
                    ...prev,
                    limit: e.target.value
                  }))}
                  className={`w-full pl-10 p-2 border rounded focus:ring-2 focus:outline-none ${
                    formErrors.limit 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  step="0.01"
                  min="0"
                />
              </div>
              {formErrors.limit && (
                <p className="text-sm text-red-600 mt-1">{formErrors.limit}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button 
              onClick={handleAddBudget}
              className="w-full flex items-center justify-center"
            >
              <Plus className="mr-1 h-5 w-5" />
              Add Budget Category
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;
