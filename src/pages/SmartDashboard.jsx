import { useTransactions } from "../context/TransactionContext";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SmartDashboard() {
  const { transactions, bills } = useTransactions();

  const currentMonth = new Date().getMonth();
  const lastMonth = (currentMonth + 11) % 12;

  const getCategorySpend = (monthIndex) =>
    transactions.filter(tx =>
      tx.type === "Expense" && new Date(tx.date).getMonth() === monthIndex
    ).reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const currentSpend = getCategorySpend(currentMonth);
  const previousSpend = getCategorySpend(lastMonth);

  const insights = Object.keys(currentSpend).map(cat => {
    const curr = currentSpend[cat];
    const prev = previousSpend[cat] || 0;
    const diff = curr - prev;
    const change = prev === 0 ? "new" : `${((diff / prev) * 100).toFixed(1)}%`;
    return { cat, curr, change };
  });

  const today = new Date().getDate();
  const upcomingBills = bills.filter(b => b.dueDay >= today).sort((a, b) => a.dueDay - b.dueDay);

  const dailySpend = {};
  transactions.forEach(tx => {
    if (tx.type === "Expense") {
      const day = format(new Date(tx.date), "yyyy-MM-dd");
      dailySpend[day] = (dailySpend[day] || 0) + tx.amount;
    }
  });

  const streak = Object.values(dailySpend).reduce((streak, amt) =>
    amt <= 1000 ? streak + 1 : 0, 0);

  const daysInMonth = new Date().getDate();
  const totalExpense = Object.values(currentSpend).reduce((a, b) => a + b, 0);
  const predicted = Math.round((totalExpense / today) * 30);

  const badges = [
    transactions.length >= 10 && "📦 Logged 10+ transactions",
    totalExpense > 10000 && "💸 Spent over ₹10k this month",
    streak >= 3 && `🔥 Low-spend streak: ${streak} days`
  ].filter(Boolean);

  const glass = "backdrop-blur-md bg-white/70 dark:bg-black/60 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 space-y-6"
    >
      <h1 className="text-4xl font-bold text-center">Smart Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insights */}
        <div className={`${glass} p-5`}>
          <h2 className="text-xl font-semibold mb-2">📊 Insights</h2>
          {insights.map(({ cat, curr, change }) => (
            <div key={cat} className="flex justify-between">
              <span className="font-medium">{cat}</span>
              <span>₹{curr} <span className="text-sm text-gray-500">({change})</span></span>
            </div>
          ))}
          {insights.length === 0 && <p className="text-sm text-gray-400 mt-2">No insights available</p>}
        </div>

        {/* Upcoming Bills */}
        <div className={`${glass} p-5`}>
          <h2 className="text-xl font-semibold mb-2">📅 Upcoming Bills</h2>
          {upcomingBills.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming bills</p>
          ) : (
            <ul className="space-y-1">
              {upcomingBills.map(b => (
                <li key={b.name} className="flex justify-between">
                  <span>{b.name}</span>
                  <span className="text-sm">₹{b.amount} on {b.dueDay}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Prediction */}
        <div className={`${glass} p-5`}>
          <h2 className="text-xl font-semibold mb-2">📈 Spending Prediction</h2>
          <p>Spent so far: <strong>₹{totalExpense}</strong></p>
          <p>Estimated total by month end: <strong className="text-blue-600 dark:text-blue-400">₹{predicted}</strong></p>
        </div>

        {/* Badges */}
        <div className={`${glass} p-5`}>
          <h2 className="text-xl font-semibold mb-2">🏆 Badges</h2>
          {badges.length === 0 ? (
            <p className="text-sm text-gray-400">No badges yet. Keep tracking!</p>
          ) : (
            <ul className="list-disc ml-5 space-y-1">
              {badges.map(b => <li key={b}>{b}</li>)}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
