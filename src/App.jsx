import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import MonthlyExpense from "./pages/MonthlyExpense";
import SmartDashboard from "./pages/SmartDashboard";


function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const location = useLocation();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans text-black dark:text-white">
       <Navbar dark={dark} setDark={setDark} />
      <AnimatePresence mode="wait">
        <div className="pt-8">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/monthly-expense" element={<MonthlyExpense />} />
            <Route path="/smart" element={<SmartDashboard />} />
          </Routes>
        </div>
      </AnimatePresence>
    </div>
  );
}

export default App;
