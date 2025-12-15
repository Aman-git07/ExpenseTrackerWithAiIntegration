import { useEffect, useState } from "react";
import {
  getAllExpenses,
  deleteExpense,
  updateExpense,
} from "../services/ExpenseService";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Paper,
  Typography,
  FormControl,
  TextField,
} from "@mui/material";

export default function EditExpense() {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const id = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getAllExpenses();
      console.log("Expenses fetched: ", response.data);
      const found = response.data.find((e) => e.id === parseInt(id));
      if (found) {
        setExpense(found);
      }
    } catch (err) {
      console.error("Error while fetching expenses: ", err);
    }
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(id, expense);
      alert("Expense updated successfully");
      navigate("/list");
    } catch (err) {
      console.error("Error while updating expense: ", err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, width: "35%" }}>
          <Typography variant="h5" gutterBottom>
            Add Expense
          </Typography>
          <form onSubmit={saveChanges}>
            <FormControl sx={{ width: "100%" }}>
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                name="title"
                label="Title"
                placeholder="Add Title"
                value={expense.title}
                onChange={handleChange}
              />
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                name="amount"
                label="Amount"
                placeholder="Add Amount"
                value={expense.amount}
                onChange={handleChange}
              />
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                name="category"
                label="Category"
                placeholder="Add Category"
                value={expense.category}
                onChange={handleChange}
              />
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                name="description"
                label="Description"
                placeholder="Add Description"
                value={expense.description}
                onChange={handleChange}
              />
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                type="date"
                name="date"
                label="Date"
                placeholder="Add Date"
                value={expense.date}
                onChange={handleChange}
              />
              <Button variant="contained" type="submit">
                Save
              </Button>
            </FormControl>
          </form>
        </Paper>
      </Box>
    </>
  );
}
