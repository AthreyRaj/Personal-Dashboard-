import { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("transactions");
  if (saved) return JSON.parse(saved);

  // First-time load: preload mock data
  const mockData = [
    {
      id: 1,
      date: "2025-06-20",
      description: "Grocery Shopping",
      amount: 1500,
      category: "Food",
      type: "Expense"
    },
    {
      id: 2,
      date: "2025-06-19",
      description: "Salary",
      amount: 20000,
      category: "Income",
      type: "Income"
    },
    {
      id: 3,
      date: "2025-06-18",
      description: "Electricity Bill",
      amount: 2400,
      category: "Utilities",
      type: "Expense"
    }
  ];

  localStorage.setItem("transactions", JSON.stringify(mockData));
  return mockData;
});


  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, handleDelete }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
