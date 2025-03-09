import React, { useState } from 'react';
import { Button } from './ui/button';

function BalanceTracking({ accounts, addAccount, deleteAccount, editAccount }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleAdd = () => {
    if (name && balance) {
      addAccount(name, parseFloat(balance));
      setName('');
      setBalance('');
    }
  };

  return (
    <div className="balance-container">
      <h2>Accounts</h2>
      <input
        type="text"
        placeholder="Account Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <Button onClick={handleAdd}>Add Account</Button>

      <ul className="accounts-list">
        {accounts.map((account) => (
          <AccountItem
            key={account.id}
            account={account}
            deleteAccount={deleteAccount}
            editAccount={editAccount}
          />
        ))}
      </ul>
    </div>
  );
}

function AccountItem({ account, deleteAccount, editAccount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(account.name);
  const [editedBalance, setEditedBalance] = useState(account.balance);

  const saveEdit = () => {
    editAccount(account.id, editedName, parseFloat(editedBalance));
    setIsEditing(false);
  };

  return (
    <li className="account-item">
      {isEditing ? (
        <>
          <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
          <input
            type="number"
            value={editedBalance}
            onChange={(e) => setEditedBalance(e.target.value)}
          />
          <Button onClick={saveEdit}>Save</Button>
        </>
      ) : (
        <>
          <span>
            {account.name}: ${account.balance.toFixed(2)}
          </span>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button onClick={() => deleteAccount(account.id)}>Delete</Button>
        </>
      )}
    </li>
  );
}

export default BalanceTracking;
