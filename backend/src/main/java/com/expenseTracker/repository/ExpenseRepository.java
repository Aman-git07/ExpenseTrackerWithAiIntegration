package com.expenseTracker.repository;

import com.expenseTracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e " +
            "WHERE YEAR(e.date) = :year AND MONTH(e.date) = :month")
    List<Expense> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

}
