import { useEffect, useState } from "react";
import { getAllExpenses, deleteExpense } from "../services/ExpenseService";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ExpenseList() {
  const [expense, setExpense] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const response = await getAllExpenses();
      console.log("fetched response: ", response);
      console.log("Expenses fetched: ", response.data);
      setExpense(response.data);
    } catch (err) {
      console.error("Error while fetching expenses: ", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete this expense?")) return;
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Error while deleting expenses: ", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          All Expenses
        </Typography>

        <Paper>
          <Table border="1" cellPadding="10" cellSpacing="0">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expense.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell>{e.amount}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/edit/${e.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(e.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
