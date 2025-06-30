import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const glass = "backdrop-blur-md bg-white/70 dark:bg-black/60 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl";

export default function AddTransaction() {
  const { setTransactions } = useTransactions();

  // Get today's date
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [form, setForm] = useState({
    date: format(today, "yyyy-MM-dd"), // stored format
    description: "",
    amount: "",
    category: "",
    type: "Expense"
  });

  // Handle other inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = date ? format(date, "yyyy-MM-dd") : "";
    setForm(prev => ({ ...prev, date: formatted }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      ...form,
      amount: parseFloat(form.amount)
    };
    setTransactions(prev => [newTx, ...prev]);
    alert("Transaction added!");

    // Reset
    const resetDate = new Date();
    setSelectedDate(resetDate);
    setForm({
      date: format(resetDate, "yyyy-MM-dd"),
      description: "",
      amount: "",
      category: "",
      type: "Expense"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-center mb-6">Add Transaction</h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`space-y-4 ${glass} p-6`}
      >
        {/* Date Picker */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select a date"
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          />
        </div>

        {/* Inputs */}
        {["description", "amount", "category"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize text-black dark:text-white mb-1">{field}</label>
            <input
              type={field === "amount" ? "number" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
            />
          </div>
        ))}

        {/* Type */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Add
        </button>
      </motion.form>
    </motion.div>
  );
}
