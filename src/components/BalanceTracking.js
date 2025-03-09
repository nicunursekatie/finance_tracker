import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

const BalanceTracking = ({ accounts, setAccounts }) => {
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: ''
  });

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

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance, 
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2" /> Account Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Accounts Summary */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Total Balance: ${totalBalance.toFixed(2)}</h3>
          
          {accounts.map(account => (
            <div key={account.id} className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{account.name}</span>
              <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${account.balance.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Add New Account */}
        <div className="mt-4 space-y-2">
          <input 
            type="text"
            placeholder="Account Name"
            value={newAccount.name}
            onChange={(e) => setNewAccount(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
          
          <input 
            type="number"
            placeholder="Initial Balance"
            value={newAccount.balance}
            onChange={(e) => setNewAccount(prev => ({
              ...prev,
              balance: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
          
          <Button 
            onClick={handleAddAccount}
            className="w-full"
          >
            Add Account
          </Button>
        </div>

        {/* Recent Transactions */}
        {accounts.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Recent Transactions</h3>
            {accounts.flatMap(account => 
              account.transactions
                .slice(0, 3)
                .map(transaction => (
                  <div key={transaction.id} className="text-sm py-1 border-b flex justify-between">
                    <div>
                      <span className="font-medium">{account.name}: </span>
                      <span>{transaction.description || transaction.category}</span>
                    </div>
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceTracking;
