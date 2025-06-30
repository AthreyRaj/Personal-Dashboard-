import { motion } from 'framer-motion';
import React, { useState } from "react";
import { useTransactions } from '../context/TransactionContext';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const glass = "backdrop-blur-md bg-white/70 dark:bg-black/60 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl";

export default function Transactions() {
  const { transactions, handleDelete } = useTransactions();

  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filtered = transactions.filter(tx => {
    const matchType = typeFilter === "All" || tx.type === typeFilter;
    const matchCategory = categoryFilter === "All" || tx.category === categoryFilter;
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchStart = !startDate || new Date(tx.date) >= startDate;
    const matchEnd = !endDate || new Date(tx.date) <= endDate;
    return matchType && matchCategory && matchSearch && matchStart && matchEnd;
  });

  const uniqueCategories = [...new Set(transactions.map(tx => tx.category))];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Transactions</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Type</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white">
            <option>All</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Category</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white">
            <option>All</option>
            {uniqueCategories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
            dateFormat="dd-mm-yyyy"
            placeholderText="Select start date"
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
            dateFormat="dd-mm-yyyy"
            placeholderText="Select end date"
            isClearable
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-1 mt-4">Search Description</label>
        <input
          type="text"
          placeholder="e.g. grocery, rent"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
        />
      </div>

      {/* Table */}
      <div className={`${glass} p-4 overflow-x-auto`}>
        <table className="w-full text-sm text-left text-black dark:text-white">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Type</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">{tx.date}</td>
                <td className="p-2">{tx.description}</td>
                <td className={`p-2 ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>₹{tx.amount}</td>
                <td className="p-2">{tx.category}</td>
                <td className="p-2">{tx.type}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(tx.id)} className="underline text-red-600 dark:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-500 dark:text-gray-400">No transactions match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
