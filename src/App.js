import React, { useState, useEffect } from 'react';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';

function App() {
  // Load initial state from localStorage or use default
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts 
      ? JSON.parse(savedAccounts) 
      : [
          {
            id: 'checking',
            name: 'Main Checking',
            balance: 0,
            transactions: []
          },
          {
            id: 'savings',
            name: 'Savings Account',
            balance: 0,
            transactions: []
          }
        ];
  });

  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets
      ? JSON.parse(savedBudgets)
      : [
          { category: 'Groceries', limit: 300, spent: 0 },
          { category: 'Dining Out', limit: 200, spent: 0 },
          { category: 'Transportation', limit: 150, spent: 0 }
        ];
  });

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Add method to reset all data
  const resetAllData = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all data? This cannot be undone.');
    if (confirmReset) {
      // Reset to initial state
      setAccounts([
        {
          id: 'checking',
          name: 'Main Checking',
          balance: 0,
          transactions: []
        },
        {
          id: 'savings',
          name: 'Savings Account',
          balance: 0,
          transactions: []
        }
      ]);

      setBudgets([
        { category: 'Groceries', limit: 300, spent: 0 },
        { category: 'Dining Out', limit: 200, spent: 0 },
        { category: 'Transportation', limit: 150, spent: 0 }
      ]);

      // Clear localStorage
      localStorage.removeItem('accounts');
      localStorage.removeItem('budgets');
    }
  };

  return (
    <div className="App container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <button 
          onClick={resetAllData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset All Data
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <BalanceTracking 
          accounts={accounts} 
          setAccounts={setAccounts} 
        />
        
        <TransactionEntry 
          accounts={accounts} 
          setAccounts={setAccounts} 
        />
      </div>
      
      <div className="mt-6">
        <BudgetTracker 
          budgets={budgets} 
          setBudgets={setBudgets} 
        />
      </div>
    </div>
  );
}

export default App;
