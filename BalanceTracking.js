import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

const BalanceTracking = ({ accounts, setAccounts }) => {
  const [newBalance, setNewBalance] = useState({
    accountId: 'checking',
    amount: ''
  });

  const handleBalanceUpdate = () => {
    if (!newBalance.amount) return;

    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === newBalance.accountId
          ? { 
              ...account, 
              balance: parseFloat(newBalance.amount),
              transactions: [
                ...account.transactions,
                {
                  id: Date.now(),
                  type: 'balance_update',
                  amount: parseFloat(newBalance.amount),
                  date: new Date().toISOString()
                }
              ]
            }
          : account
      )
    );

    // Reset form
    setNewBalance({ accountId: 'checking', amount: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2" /> Account Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.map(account => (
          <div key={account.id} className="mb-4">
            <div className="flex justify-between">
              <span className="font-medium">{account.name}</span>
              <span className="font-bold">${account.balance.toFixed(2)}</span>
            </div>
          </div>
        ))}

        <div className="mt-4 space-y-2">
          <select
            value={newBalance.accountId}
            onChange={(e) => setNewBalance(prev => ({
              ...prev,
              accountId: e.target.value
            }))}
            className="w-full p-2 border rounded"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          
          <input 
            type="number"
            placeholder="New Balance"
            value={newBalance.amount}
            onChange={(e) => setNewBalance(prev => ({
              ...prev,
              amount: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
          
          <Button 
            onClick={handleBalanceUpdate}
            className="w-full"
          >
            Update Balance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceTracking;
