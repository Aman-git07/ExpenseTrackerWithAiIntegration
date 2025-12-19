import { useEffect, useState } from "react";
import {
  getAiInsights,
  getCurrentMonthExpenses,
} from "../services/ExpenseService";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyReport() {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const response = await getCurrentMonthExpenses();
        console.log("Current month expenses fetched: ", response);
        let resp = response.data;
        setExpenses(response.data);
        const total = response.data.reduce(
          (sum, expense) => sum + parseFloat(expense.amount),
          0
        );
        setMonthlyTotal(total);

        const categorySum = {};
        response.data.forEach((expense) => {
          categorySum[expense.category] =
            (categorySum[expense.category] || 0) + parseFloat(expense.amount);
        });
        const list = Object.entries(categorySum).map(([name, value]) => ({
          name,
          value,
        }));
        setCategoryTotals(list);
      } catch (err) {
        console.error("Error while fetching current month expenses: ", err);
      }
    };
    fetchMonthlyExpenses();
  }, []);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
  ];

  async function generateAIReport() {
    setLoadingAI(true);
    setAiInsights([]);
    try {
      const response = await getAiInsights(
        monthlyTotal,
        categoryTotals,
        expenses
      );
      console.log("ai insights fetched: ", response);

      const text = await response.text();
      const formatted = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      setAiInsights(formatted);
    } catch (error) {
      console.error("Error fetching AI insights: ", error);
    }
    setLoadingAI(false);
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Monthly Report
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height={400}
        mt={3}
      >
        {" "}
        <ResponsiveContainer width={500} height={400}>
          <PieChart height={400}>
            <Pie
              data={categoryTotals}
              labelLine={false}
              outerRadius={120}
              cx="50%"
              cy="50%"
              fill="#8884d8"
              dataKey="value"
              label={(entry) => `${entry.name} ₹${entry.value}`}
            >
              {" "}
              {categoryTotals.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      {/* setting AI response; can also use MUI list instead of bullets */}
      <Button variant="contained" color="secondary" onClick={generateAIReport}>
        Generate AI Insights
      </Button>
      {loadingAI ? (
        <Typography mt={3}>Analyzing your expenses...</Typography>
      ) : aiInsights.length > 0 ? (
        <Paper sx={{ p: 2, mt: 3, background: "#f8f9fa" }}>
          <Typography variant="h6">AI Insights</Typography>
          <Box mt={1}>
            {aiInsights.map((point, index) => (
              <Typography key={index} sx={{ mb: 1 }}>
                • {point}
              </Typography>
            ))}
          </Box>
        </Paper>
      ) : null}
      {/* Table for total expenses */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Total Expenses This Month: ₹{monthlyTotal}
      </Typography>
      <Typography variant="h6" mb={2}>
        Expense List:
      </Typography>
      <Paper sx={{ p: 3, width: "90%", marginTop: 2, overflowX: "auto" }}>
        <Table border="1" cellPadding="8">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>₹{e.amount}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
