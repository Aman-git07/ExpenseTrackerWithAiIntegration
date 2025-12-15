package com.expenseTracker.controller;

import com.expenseTracker.model.Expense;
import com.expenseTracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value= "/expense")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseContoller {
    private final ExpenseService expenseService;

    public ExpenseContoller(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    //Create an expense
    @PostMapping
    public Expense create(@RequestBody Expense expense){
        return expenseService.createExpense(expense);
    }

    //Get all expenses
    @GetMapping
    public List<Expense> getAll(){
        return expenseService.getAllExpenses();
    }

    // Get expenses for a specific year + month
    @GetMapping("month/{year}/{month}")
    public List<Expense> getExpensesByMonth(@PathVariable int year,@PathVariable int month){
        return expenseService.getExpensesByMonth(year, month);
    }

    //Get expenses for current month
    @GetMapping("/month/current")
    public List<Expense> getExpensesForCurrentMonth(){
        return expenseService.getExpensesForCurrentMonth();
    }

    //Delete an expense
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        expenseService.deleteExpense(id);
    }

    //Update an expense
    @PutMapping("/{id}")
    public  Expense update(@PathVariable Long id,@RequestBody Expense expense){
        return expenseService.updateExpense(id, expense);
    }

}
