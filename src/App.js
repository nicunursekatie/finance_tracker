import React, { useState, useEffect } from 'react';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';

function App() {
  // ... previous state and localStorage logic ...

  // New state for showing transactions
  const [showTransactions, setShowTransactions] = useState(false);

  // Collect all transactions from all accounts
  const allTransactions = accounts.flatMap(account => 
    account.transactions.map(transaction => ({
      ...transaction,
      accountName: account.name
    }))
  );

  // Sort transactions by date, most recent first
  const sortedTransactions = allTransactions.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="App container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowTransactions(!showTransactions)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showTransactions ? 'Hide' : 'Show'} Transaction History
          </button>
          <button 
            onClick={resetAllData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset All Data
          </button>
        </div>
      </div>
      
      {!showTransactions ? (
        <>
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
        </>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold leading-6 text-gray-900">
              Transaction History
            </h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTransactions.map((transaction, index) => (
                  <tr key={index} className={
                    transaction.type === 'income' 
                      ? 'bg-green-50' 
                      : 'bg-red-50'
                  }>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.accountName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.category || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
