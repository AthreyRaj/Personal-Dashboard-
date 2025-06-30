import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ dark, setDark }) {
  const location = useLocation();
  const active = (path) =>
  location.pathname === path
    ? "bg-gray-900 text-white dark:bg-white dark:text-black px-3 py-1 rounded"
    : "hover:underline";


  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/60 border-b border-gray-200 dark:border-gray-800 p-4 shadow-md w-full"
    >
      <div className="flex w-full items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex space-x-6">
          <Link to="/" className={`font-medium ${active("/")}`}>Dashboard</Link>
          <Link to="/transactions" className={`font-medium ${active("/transactions")}`}>Transactions</Link>
          <Link to="/add-transaction" className={`font-medium ${active("/add-transaction")}`}>Add</Link>
          <Link to="/monthly-expense" className={`font-medium ${active("/monthly-expense")}`}>Monthly</Link>
          <Link to="/smart" className={`font-medium ${active("/smart")}`}>Insights</Link>
        </div>
        <div>
          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-1 rounded bg-gray-900 text-white dark:bg-white dark:text-black transition"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
