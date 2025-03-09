import React, { useState, useEffect } from 'react';

function App() {
  // Initialize accounts state from localStorage or as an empty array
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });

  // Effect to update localStorage whenever accounts state changes
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Function to add a new account
  const addAccount = (account) => {
    setAccounts([...accounts, account]);
  };

  // Function to delete an account by id
  const deleteAccount = (id) => {
    const updatedAccounts = accounts.filter((account) => account.id !== id);
    setAccounts(updatedAccounts);
  };

  // Function to edit an existing account
  const editAccount = (id, updatedAccount) => {
    const updatedAccounts = accounts.map((account) =>
      account.id === id ? { ...account, ...updatedAccount } : account
    );
    setAccounts(updatedAccounts);
  };

  // Render the list of accounts with edit and delete options
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
