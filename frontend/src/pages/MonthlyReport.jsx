import { useEffect, useState } from "react";
import { getCurrentMonthExpenses } from "../services/ExpenseService";
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
  //hugging face token and model value for AI integration
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
  const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

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
        //setCategoryTotals(categorySum);
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
    setAiInsights("Generating insights...");
    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: `
              You are a financial analysis AI. 
              Analyze the user's monthly expenses and generate insights.
              Use ₹ symbol for currency.
              Return each insight on a new line.
              Do not use symbols like *, -, • or markdown.
              Only plain sentences separated by newline.
              Do NOT return JSON.
              `,
              },
              {
                role: "user",
                content: JSON.stringify({
                  monthlyTotal,
                  categoryTotals,
                  expenses,
                }),
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("ai resp: ", data);

      const output = data?.choices?.[0]?.message?.content?.trim();
      const formattedInsights = output
        .split("\n")
        .map((line) => line.replace(/^[•*-]\s*/, "").trim())
        .filter((line) => line.length > 0);

      setAiInsights(formattedInsights);
    } catch (err) {
      setAiInsights("Error while api call: " + err.message);
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
        //Using PieChart for chart creation; mapping categories as cells
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
      //setting AI response; can also use MUI list instead of bullets
      <Button variant="contained" color="secondary" onClick={generateAIReport}>
        Generate AI Insights
      </Button>
      {loadingAI ? (
        <Typography mt={3}>Analyzing your expenses...</Typography>
      ) : aiInsights ? (
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
      //Table for total expenses
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
