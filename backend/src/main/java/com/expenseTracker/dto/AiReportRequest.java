package com.expenseTracker.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AiReportRequest {
    private double monthlyTotal;
    private List<Map<String, Object>> categoryTotals;
    private List<Map<String, Object>> expenses;


}
