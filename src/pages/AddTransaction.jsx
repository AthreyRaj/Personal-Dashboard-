import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const glass = "backdrop-blur-md bg-white/70 dark:bg-black/60 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl";

export default function AddTransaction() {
  const { setTransactions } = useTransactions();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [receipt, setReceipt] = useState(null);

  const [form, setForm] = useState({
    date: format(today, "yyyy-MM-dd"),
    description: "",
    notes: "",
    amount: "",
    category: "",
    type: "Expense",
    receipt: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = date ? format(date, "yyyy-MM-dd") : "";
    setForm(prev => ({ ...prev, date: formatted }));
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReceipt(file);
      setForm(prev => ({ ...prev, receipt: url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      ...form,
      amount: parseFloat(form.amount)
    };
    setTransactions(prev => [newTx, ...prev]);
    alert("Transaction added!");
    const resetDate = new Date();
    setSelectedDate(resetDate);
    setReceipt(null);
    setForm({
      date: format(resetDate, "yyyy-MM-dd"),
      description: "",
      notes: "",
      amount: "",
      category: "",
      type: "Expense",
      receipt: ""
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

        {/* Description */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes or memo"
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white dark:bg-black text-black dark:text-white"
          />
        </div>

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

        {/* Receipt Upload */}
        <div>
          <label className="block font-medium text-black dark:text-white mb-1">Receipt (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleReceiptUpload}
            className="w-full"
          />
          {receipt && (
            <img src={URL.createObjectURL(receipt)} alt="Receipt" className="mt-3 max-h-40 rounded" />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </motion.form>
    </motion.div>
  );
}
