import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const TransactionEntry = ({ accounts = [], setAccounts }) => {
  const [transaction, setTransaction] = useState({
    accountId: accounts.length > 0 ? accounts[0].id : '',
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  });

  // Ensure we have a valid account selected if accounts change
  useEffect(() => {
    if (accounts.length > 0 && !accounts.some(acc => acc.id === transaction.accountId)) {
      setTransaction(prev => ({
        ...prev,
        accountId: accounts[0].id
      }));
    }
  }, [accounts]);

  const handleTransactionSubmit = () => {
    if (!transaction.amount || accounts.length === 0) return;

    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === transaction.accountId
          ? { 
              ...account, 
              balance: transaction.type === 'expense'
                ? account.balance - parseFloat(transaction.amount)
                : account.balance + parseFloat(transaction.amount),
              transactions: [
                ...account.transactions,
                {
                  id: Date.now(),
                  type: transaction.type,
                  amount: parseFloat(transaction.amount),
                  category: transaction.category,
                  description: transaction.description,
                  date: new Date().toISOString()
                }
              ]
            }
          : account
      )
    );

    // Reset form
    setTransaction({
      accountId: accounts.length > 0 ? accounts[0].id : '',
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
  };

  // Render nothing if no accounts
  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent>
          <p>Please add an account first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2" /> Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <select
            value={transaction.accountId}
            onChange={(e) => setTransaction(prev => ({
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

          <select
            value={transaction.type}
            onChange={(e) => setTransaction(prev => ({
              ...prev,
              type: e.target.value
            }))}
            className="w-full p-2 border rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input 
            type="number"
            placeholder="Amount"
            value={transaction.amount}
            onChange={(e) => setTransaction(prev => ({
              ...prev,
              amount: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />

          <input 
            type="text"
            placeholder="Category"
            value={transaction.category}
            onChange={(e) => setTransaction(prev => ({
              ...prev,
              category: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />

          <input 
            type="text"
            placeholder="Description (optional)"
            value={transaction.description}
            onChange={(e) => setTransaction(prev => ({
              ...prev,
              description: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />

          <Button 
            onClick={handleTransactionSubmit}
            className="w-full"
            disabled={accounts.length === 0}
          >
            Add Transaction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionEntry;
