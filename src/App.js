import React, { useState, useEffect } from 'react';
import './index.css';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';
import SpendingVisualization from './components/SpendingVisualization';
import { Card } from './components/ui/card';
import './index.css';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';
import SpendingVisualization from './components/SpendingVisualization';
import { Card } from './components/ui/card';

function App() {
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = localStorage.getItem('accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
    const storedAccounts = localStorage.getItem('accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  });

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (name, balance) => {
    setAccounts([...accounts, { id: Date.now(), name, balance }]);
  const addAccount = (name, balance) => {
    setAccounts([...accounts, { id: Date.now(), name, balance, transactions: [] }]);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const editAccount = (id, updatedName, updatedBalance) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, name: updatedName, balance: updatedBalance } : acc
      )
    );
  const editAccount = (id, updatedName, updatedBalance) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, name: updatedName, balance: updatedBalance } : acc
      )
    );
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Finance Tracker</h1>
      <Card>
        <BalanceTracking
          accounts={accounts}
          setAccounts={setAccounts}
          addAccount={addAccount}
          deleteAccount={deleteAccount}
          editAccount={editAccount}
        />
      </Card>
      <Card>
        <TransactionEntry accounts={accounts} setAccounts={setAccounts} />
      </Card>
      <Card>
        <BudgetTracker />
      </Card>
      <Card>
        <SpendingVisualization accounts={accounts} />
      </Card>
    </div>
  );
}

export default App;