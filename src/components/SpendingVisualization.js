import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';

const SpendingVisualization = ({ accounts }) => {
  const [timeframeData, setTimeframeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    
    // Prepare data for visualizations
    prepareTimeframeData();
    prepareCategoryData();
    prepareAccountData();
  }, [accounts]);
  
  const prepareTimeframeData = () => {
    // Get all transactions from all accounts
    const allTransactions = accounts.flatMap(account => 
      account.transactions.map(t => ({
        ...t,
        accountName: account.name
      }))
    );
    
    // Group by date (using just the date part)
    const groupedByDate = {};
    allTransactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === 'income') {
        groupedByDate[date].income += transaction.amount;
      } else {
        groupedByDate[date].expense += transaction.amount;
      }
    });
    
    // Convert to array and sort by date
    const timeData = Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
    
    setTimeframeData(timeData);
  };
  
  const prepareCategoryData = () => {
    // Get all expense transactions
    const expenseTransactions = accounts.flatMap(account => 
      account.transactions.filter(t => t.type === 'expense')
    );
    
    // Group by category
    const groupedByCategory = {};
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = 0;
      }
      groupedByCategory[category] += transaction.amount;
    });
    
    // Convert to array for visualization
    const categoryData = Object.entries(groupedByCategory).map(([name, value]) => ({
      name,
      value
    }));
    
    setCategoryData(categoryData);
  };
  
  const prepareAccountData = () => {
    // Prepare account balance data
    const accountData = accounts.map(account => ({
      name: account.name,
      balance: account.balance
    }));
    
    setAccountData(accountData);
  };
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // If no transaction data yet
  if (timeframeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Visualization</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p>Add some transactions to see visualizations</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overtime">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overtime" className="flex items-center justify-center">
              <BarChartIcon className="w-4 h-4 mr-2" />
              Over Time
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 mr-2" />
              By Category
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center justify-center">
              <BarChartIcon className="w-4 h-4 mr-2" />
              Accounts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overtime" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeframeData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#FF8042" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="category" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          


cat > src/App.js << 'EOL'
import React, { useState, useEffect } from 'react';
import BalanceTracking from './components/BalanceTracking';
import TransactionEntry from './components/TransactionEntry';
import BudgetTracker from './components/BudgetTracker';
import SpendingVisualization from './components/SpendingVisualization';

function App() {
  // Load initial state from localStorage or use default
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts 
      ? JSON.parse(savedAccounts) 
      : [
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
        ];
  });

  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets
      ? JSON.parse(savedBudgets)
      : [
          { category: 'Groceries', limit: 300, spent: 0 },
          { category: 'Dining Out', limit: 200, spent: 0 },
          { category: 'Transportation', limit: 150, spent: 0 }
        ];
  });

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Add method to reset all data
  const resetAllData = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all data? This cannot be undone.');
    if (confirmReset) {
      // Reset to initial state
      setAccounts([
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

      setBudgets([
        { category: 'Groceries', limit: 300, spent: 0 },
        { category: 'Dining Out', limit: 200, spent: 0 },
        { category: 'Transportation', limit: 150, spent: 0 }
      ]);

      // Clear localStorage
      localStorage.removeItem('accounts');
      localStorage.removeItem('budgets');
    }
  };

  return (
    <div className="App container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <button 
          onClick={resetAllData}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset All Data
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <BalanceTracking 
          accounts={accounts} 
          setAccounts={setAccounts} 
        />
        
        <TransactionEntry 
          accounts={accounts} 
          setAccounts={setAccounts} 
        />
      </div>
      
      <div className="mb-6">
        <SpendingVisualization 
          accounts={accounts} 
        />
      </div>
      
      <div>
        <BudgetTracker 
          budgets={budgets} 
          setBudgets={setBudgets}
          accounts={accounts}
        />
      </div>
    </div>
  );
}

export default App;
