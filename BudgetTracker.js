import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart } from 'lucide-react';

const BudgetTracker = ({ budgets, setBudgets }) => {
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: ''
  });

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) return;

    setBudgets(prev => [
      ...prev,
      {
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        spent: 0
      }
    ]);

    // Reset form
    setNewBudget({ category: '', limit: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2" /> Budget Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Existing Budget Categories */}
        {budgets.map(budget => (
          <div key={budget.category} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{budget.category}</span>
              <span>
                ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  budget.spent / budget.limit > 0.8 
                    ? 'bg-red-500' 
                    : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min(budget.spent / budget.limit * 100, 100)}%`
                }}
              />
            </div>
          </div>
        ))}

        {/* Add New Budget Category */}
        <div className="mt-4 space-y-2">
          <input 
            type="text"
            placeholder="Category Name"
            value={newBudget.category}
            onChange={(e) => setNewBudget(prev => ({
              ...prev,
              category: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
          
          <input 
            type="number"
            placeholder="Monthly Limit"
            value={newBudget.limit}
            onChange={(e) => setNewBudget(prev => ({
              ...prev,
              limit: e.target.value
            }))}
            className="w-full p-2 border rounded"
          />
          
          <Button 
            onClick={handleAddBudget}
            className="w-full"
          >
            Add Budget Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;
