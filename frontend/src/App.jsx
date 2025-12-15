import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import AddExpense from "./components/AddExpense.jsx";
import ExpensesList from "./components/ExpenseList.jsx";
import MonthlyReport from "./pages/MonthlyReport.jsx";
import EditExpense from "./components/EditExpense.jsx";
import MonthlyExpenseFilter from "./components/MonthlyExpenseFilter.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/list" element={<ExpensesList />} />
        <Route path="/edit/:id" element={<EditExpense />} />
        <Route path="/expenses/filter" element={<MonthlyExpenseFilter />} />
        <Route path="/report" element={<MonthlyReport />} />
      </Routes>
    </>
  );
}

export default App;
