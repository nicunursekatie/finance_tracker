import React, { useState, useEffect } from 'react';
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
  });

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Function to add a new account
  const addAccount = (account) => {
    setAccounts([...accounts, account]);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const editAccount = (id, updatedName, updatedBalance) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, name: updatedName, balance: updatedBalance } : acc
      )
    );
  };

  return (
    <div>
      <h1>Finance Tracker</h1>
      <AccountForm addAccount={addAccount} />
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <AccountItem
              account={account}
              deleteAccount={deleteAccount}
              editAccount={editAccount}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component for adding a new account
function AccountForm({ addAccount }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && balance) {
      const newAccount = {
        id: Date.now(),
        name,
        balance: parseFloat(balance),
      };
      addAccount(newAccount);
      setName('');
      setBalance('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Account Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        required
      />
      <button type="submit">Add Account</button>
    </form>
  );
}

// Component for displaying an account with edit and delete options
function AccountItem({ account, deleteAccount, editAccount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance);

  const handleEdit = () => {
    if (isEditing) {
      editAccount(account.id, { name, balance: parseFloat(balance) });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </>
      ) : (
        <>
          <span>{account.name}: ${account.balance.toFixed(2)}</span>
        </>
      )}
      <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
      <button onClick={() => deleteAccount(account.id)}>Delete</button>
    </div>
  );
}

export default App;