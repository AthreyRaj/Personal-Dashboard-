import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useTransactions } from "../context/TransactionContext";
import { motion } from "framer-motion";
import { format, parse } from "date-fns";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MonthlyExpense() {
  const { transactions } = useTransactions();

  // Group expenses by year-month
  const monthlyTotals = transactions.reduce((acc, tx) => {
    if (tx.type !== "Expense") return acc;
    const [year, month] = tx.date.split("-");
    const key = `${year}-${month}`;
    acc[key] = (acc[key] || 0) + tx.amount;
    return acc;
  }, {});

  const rawMonths = Object.keys(monthlyTotals).sort();
  const months = rawMonths.map(m =>
    format(parse(m, "yyyy-MM", new Date()), "MMM yyyy")
  );
  const amounts = rawMonths.map(m => monthlyTotals[m]);

  const isDark = document.documentElement.classList.contains("dark");

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#ffffff" : "#111111",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#ffffff" : "#111111" },
        grid: { color: isDark ? "#333333" : "#dddddd" },
      },
      y: {
        ticks: { color: isDark ? "#ffffff" : "#111111" },
        grid: { color: isDark ? "#333333" : "#dddddd" },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-center mb-6">Monthly Expenses</h1>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6">
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                label: "Expenses",
                data: amounts,
                backgroundColor: "#f87171",
              },
            ],
          }}
          options={chartOptions}
        />
      </div>
    </motion.div>
  );
}
