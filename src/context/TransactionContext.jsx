import { createContext, useContext, useEffect, useState } from "react";

export const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  // Transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) return JSON.parse(saved);

    // Preload mock data for first-time users
    const mockData = [
      {
        id: 1,
        date: "2025-06-20",
        description: "Grocery Shopping",
        notes: "Bought veggies and snacks",
        amount: 1500,
        category: "Food",
        type: "Expense",
        receipt: ""
      },
      {
        id: 2,
        date: "2025-06-19",
        description: "Salary",
        notes: "Company payout",
        amount: 20000,
        category: "Income",
        type: "Income",
        receipt: ""
      },
      {
        id: 3,
        date: "2025-06-18",
        description: "Electricity Bill",
        notes: "Paid online",
        amount: 2400,
        category: "Utilities",
        type: "Expense",
        receipt: ""
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

  // Upcoming Bills
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("bills");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Netflix", amount: 499, dueDay: 5 },
          { name: "Wi-Fi", amount: 999, dueDay: 10 }
        ];
  });

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        handleDelete,
        bills,
        setBills
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
