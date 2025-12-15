package com.expenseTracker.service;

import com.expenseTracker.model.Expense;
import com.expenseTracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.util.List;

@Service
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseService {
    public final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense e){
        return expenseRepository.save(e);
    }

    public List<Expense> getAllExpenses(){
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByMonth(int year, int month){
        return expenseRepository.findByYearAndMonth(year, month);
    }

    public List<Expense> getExpensesForCurrentMonth() {
        LocalDate now = LocalDate.now();
        return expenseRepository.findByYearAndMonth(now.getYear(), now.getMonthValue());
    }

    public void deleteExpense(Long id){
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense e){
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Expense with provided id not found"));
        existing.setTitle(e.getTitle());
        existing.setAmount(e.getAmount());
        existing.setCategory(e.getCategory());
        existing.setDescription(e.getDescription());
        existing.setDate(e.getDate());

        return expenseRepository.save(existing);
    }

}
