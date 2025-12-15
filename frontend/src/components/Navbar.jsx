import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart Expense Tracker
          </Typography>
          <Button color="inherit" href="/">
            Home
          </Button>
          <Button color="inherit" href="/add">
            Add Expense
          </Button>
          <Button color="inherit" href="/list">
            Expenses List
          </Button>
          <Button color="inherit" href="/report">
            Monthly Report
          </Button>
          <Button color="inherit" href="/expenses/filter">
            Filter Expenses
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
