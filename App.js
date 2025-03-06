import React, { useState } from 'react';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';

function App() {
  // Main application state
  const [accounts, setAccounts] = useState([
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

  const [budgets, setBudgets] = useState([
    { category: 'Groceries', limit: 300, spent: 0 },
    { category: 'Dining Out', limit: 200, spent: 0 },
    { category: 'Transportation', limit: 150, spent: 0 }
  ]);

  return (
    <div className="App container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Tracker</h1>
      
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
