import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  // Load accounts from localStorage
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = localStorage.getItem('accounts');
      return savedAccounts 
        ? JSON.parse(savedAccounts) 
        : [
            { id: 'checking', name: 'Checking Account', balance: 1000, transactions: [] },
            { id: 'savings', name: 'Savings Account', balance: 5000, transactions: [] }
          ];
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      return [
        { id: 'checking', name: 'Checking Account', balance: 1000, transactions: [] },
        { id: 'savings', name: 'Savings Account', balance: 5000, transactions: [] }
      ];
    }
  });
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: ''
  });
  
  const [transaction, setTransaction] = useState({
    accountId: accounts.length > 0 ? accounts[0].id : '',
    type: 'expense',
    amount: '',
    description: ''
  });
  
  const [activeTab, setActiveTab] = useState('accounts');
  
  // Save accounts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [accounts]);
  
  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setAccounts([
        { id: 'checking', name: 'Checking Account', balance: 1000, transactions: [] },
        { id: 'savings', name: 'Savings Account', balance: 5000, transactions: [] }
      ]);
    }
  };
  
  const handleAddAccount = () => {
    if (!newAccount.name) return;
    
    setAccounts(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newAccount.name,
        balance: parseFloat(newAccount.balance) || 0,
        transactions: []
      }
    ]);
    
    // Reset form
    setNewAccount({ name: '', balance: '' });
  };
  
  const handleTransactionSubmit = () => {
    if (!transaction.amount || parseFloat(transaction.amount) <= 0 || !transaction.accountId) {
      alert("Please enter a valid amount and select an account");
      return;
    }
    
    const amount = parseFloat(transaction.amount);
    
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === transaction.accountId
          ? { 
              ...account, 
              balance: transaction.type === 'expense'
                ? account.balance - amount
                : account.balance + amount,
              transactions: [
                ...account.transactions,
                {
                  id: Date.now(),
                  type: transaction.type,
                  amount: amount,
                  description: transaction.description,
                  date: new Date().toISOString()
                }
              ]
            }
          : account
      )
    );
    
    // Show confirmation
    alert(`${transaction.type === 'expense' ? 'Expense' : 'Income'} of $${amount.toFixed(2)} ${transaction.type === 'expense' ? 'from' : 'to'} ${accounts.find(a => a.id === transaction.accountId).name} recorded!`);
    
    // Reset form
    setTransaction({
      accountId: transaction.accountId,
      type: 'expense',
      amount: '',
      description: ''
    });
  };
  
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="container">
      <div className="header">
        <h1>Finance Tracker</h1>
        <div>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className="add-transaction-btn"
          >
            Quick Transaction
          </button>
          <button className="danger" onClick={resetData}>Reset</button>
        </div>
      </div>
      
      {activeTab === 'accounts' && (
        <div className="card">
          <h2>Accounts</h2>
          <p className="total-balance">Total Balance: ${totalBalance.toFixed(2)}</p>
          
          <div className="accounts-list">
            {accounts.map(account => (
              <div key={account.id} className="account-item">
                <h3>{account.name}</h3>
                <div className="account-details">
                  <p className={account.balance >= 0 ? 'positive' : 'negative'}>
                    ${account.balance.toFixed(2)}
                  </p>
                  <button 
                    className="quick-action"
                    onClick={() => {
                      setTransaction({...transaction, accountId: account.id});
                      setActiveTab('transactions');
                    }}
                  >
                    Add Transaction
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="add-account">
            <h3>Add New Account</h3>
            <input
              type="text"
              placeholder="Account Name"
              value={newAccount.name}
              onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Initial Balance"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
            />
            <button onClick={handleAddAccount}>Add Account</button>
          </div>
          
          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            {accounts.flatMap(account => 
              account.transactions.slice(0, 5).map(t => ({
                ...t,
                accountName: account.name
              }))
            ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).length > 0 ? (
              <div className="mini-transactions">
                {accounts.flatMap(account => 
                  account.transactions.slice(0, 5).map(t => ({
                    ...t,
                    accountName: account.name
                  }))
                )
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map(t => (
                  <div key={t.id} className="mini-transaction">
                    <div>
                      <span>{t.accountName}</span>
                      <span className="transaction-date">{new Date(t.date).toLocaleDateString()}</span>
                      {t.description && <p className="transaction-desc">{t.description}</p>}
                    </div>
                    <span className={t.type === 'income' ? 'positive' : 'negative'}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-transactions">No recent transactions</p>
            )}
            
            <button 
              onClick={() => setActiveTab('transactions')}
              className="secondary-btn"
            >
              Add New Transaction
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <div className="card transaction-card">
          <h2>Quick Transaction</h2>
          
          <div className="transaction-form">
            <div className="form-group">
              <label>Account</label>
              <select
                value={transaction.accountId}
                onChange={(e) => setTransaction({...transaction, accountId: e.target.value})}
                className="account-select"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Transaction Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${transaction.type === 'expense' ? 'expense-active' : ''}`}
                  onClick={() => setTransaction({...transaction, type: 'expense'})}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${transaction.type === 'income' ? 'income-active' : ''}`}
                  onClick={() => setTransaction({...transaction, type: 'income'})}
                >
                  Income
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Amount</label>
              <div className="amount-input">
                <span className="dollar-sign">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={transaction.amount}
                  onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                  className="amount-field"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description (Optional)</label>
              <input
                type="text"
                placeholder="What's this for?"
                value={transaction.description}
                onChange={(e) => setTransaction({...transaction, description: e.target.value})}
              />
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={() => setActiveTab('accounts')}
                className="secondary-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleTransactionSubmit}
                className={transaction.type === 'expense' ? 'expense-btn' : 'income-btn'}
              >
                Save {transaction.type === 'expense' ? 'Expense' : 'Income'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
