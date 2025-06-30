import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useTransactions } from '../context/TransactionContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const glass = "backdrop-blur-md bg-white/70 dark:bg-black/60 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl";

export default function Dashboard() {
  const { transactions } = useTransactions();

  const balance = transactions.reduce((acc, tx) => tx.type === "Income" ? acc + tx.amount : acc - tx.amount, 0);
  const income = transactions.filter(tx => tx.type === "Income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(tx => tx.type === "Expense").reduce((a, b) => a + b.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: "Balance", value: balance }, { label: "Income", value: income }, { label: "Expense", value: expense }].map(stat => (
          <div key={stat.label} className={`${glass} p-6 text-center`}>
            <p className="text-sm text-black dark:text-white">{stat.label}</p>
            <p className="text-2xl font-bold text-black dark:text-white">₹{stat.value}</p>
          </div>
        ))}
      </div>
      <div className={`${glass} p-6`}>
        <h2 className="text-lg font-bold mb-2">Recent Transactions</h2>
        <ul className="space-y-2 text-sm text-black dark:text-white">
          {transactions.slice(0, 5).map(tx => (
            <li key={tx.id} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-1">
              <span>{tx.description}</span>
              <span className={tx.type === "Income" ? "text-green-600" : "text-red-600"}>₹{tx.amount}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${glass} p-6`}>
        <h2 className="text-lg font-bold mb-2">Spending Breakdown</h2>
        <Pie
          key={JSON.stringify(transactions)}
          data={{
            labels: ["Income", "Expense"],
            datasets: [{
              data: [income, expense],
              backgroundColor: ["#34d399", "#f87171"],
              hoverOffset: 8
            }]
          }}
        />
      </div>
    </motion.div>
  );
}
