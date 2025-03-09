import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function SpendingVisualization({ accounts }) {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    console.log('useEffect called');
    if (!accounts || accounts.length === 0) {
      console.log('No accounts or empty accounts array');
      setCategoryData([]);
      return;
    }

    const transactions = accounts.flatMap(acc => acc.transactions || []);
    const groupedByCategory = {};

    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      groupedByCategory[category] = (groupedByCategory[category] || 0) + transaction.amount;
    });

    const formattedData = Object.keys(groupedByCategory).map(category => ({
      name: category,
      value: groupedByCategory[category],
    }));

    console.log('Formatted data:', formattedData);
    setCategoryData(formattedData);
  }, [accounts]);

  console.log('categoryData:', categoryData);

  if (!accounts || accounts.length === 0 || categoryData.length === 0) {
    return (
      <div className="spending-visualization">
        <p>Add transactions to visualize spending.</p>
      </div>
    );
  }

  return (
    <div className="spending-visualization">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie 
            data={categoryData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={80}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingVisualization;