import { useState } from "react";
import { addExpense } from "../services/ExpenseService";
import {
  FormControl,
  TextField,
  Button,
  Box,
  Paper,
  Typography,
} from "@mui/material";

export default function AddExpense() {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const saveExpense = async (e) => {
    e.preventDefault();
    console.log("expense submitted: ", e);
    try {
      await addExpense(expense);
      setExpense({
        title: "",
        amount: "",
        category: "",
        description: "",
        date: "",
      });
      alert("Expense added successfully");
    } catch (err) {
      console.error("Error while saving expense: ", err);
    }
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, width: "35%" }}>
          <Typography variant="h5" gutterBottom>
            Add Expense
          </Typography>
          <form onSubmit={saveExpense}>
            <FormControl sx={{ width: "100%" }}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                margin="normal"
                value={expense.title}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                margin="normal"
                type="number"
                value={expense.amount}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="category"
                label="Category"
                margin="normal"
                value={expense.category}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="description"
                label="Description"
                margin="normal"
                value={expense.description}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="date"
                type="date"
                label="Date"
                margin="normal"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={expense.date}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ mt: 2 }}
                onClick={saveExpense}
              >
                Save
              </Button>
            </FormControl>
          </form>
        </Paper>
      </Box>
    </>
  );
}
