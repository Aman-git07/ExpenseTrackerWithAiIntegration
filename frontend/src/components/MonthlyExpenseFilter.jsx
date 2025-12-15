import { useState } from "react";
import {
  getExpenseByMonth,
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
  TextField,
  Typography,
} from "@mui/material";

export default function MonthlyExpenseFilter() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [expenses, setExpenses] = useState([]);

  const fetchCurrentMonthExpenses = async () => {
    try {
      const response = await getCurrentMonthExpenses();
      console.log("Current month expenses fetched: ", response.data);
      setExpenses(response.data);
    } catch (err) {
      console.error("Error while fetching current month expenses: ", err);
    }
  };

  const fetchExpensesByMonth = async () => {
    if (!year || !month) {
      alert("Please select both year and month");
      return;
    }
    try {
      const response = await getExpenseByMonth(year, month);
      console.log(`Expenses for ${month}/${year} fetched: `, response.data);
      setExpenses(response.data);
    } catch (err) {
      console.error("Error while fetching expenses by month: ", err);
    }
  };

  return (
    <>
      <Box
        p={3}
        sx={{ justifyContent: "center", display: "flex", width: "95%" }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Filter
          </Typography>
          <br />
          <br />
          <Box sx={{ width: "50%", justifySelf: "center" }}>
            <TextField
              fullWidth
              type="number"
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Month"
              placeholder="1 (Jan) - 12 (Dec)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={fetchExpensesByMonth}
            >
              Search
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={fetchCurrentMonthExpenses}
            >
              Show Current Month Expenses
            </Button>
          </Box>

          <br />

          <h3>Results</h3>
          {expenses.length === 0 ? (
            <p>No expenses found for the selected month.</p>
          ) : (
            <Paper sx={{ p: 3, width: "90%" }}>
              <Table border="1" cellPadding="10" cellSpacing="0">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.title}</TableCell>
                      <TableCell>{e.amount}</TableCell>
                      <TableCell>{e.category}</TableCell>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Paper>
      </Box>
    </>
  );
}
