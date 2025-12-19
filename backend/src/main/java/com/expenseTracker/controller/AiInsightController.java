package com.expenseTracker.controller;

import com.expenseTracker.dto.AiReportRequest;
import com.expenseTracker.service.AiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expense/ai")
@CrossOrigin
public class AiInsightController {
    public final AiService aiService;

    public AiInsightController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/monthly-report")
    public String generateMonthlyReport(@RequestBody AiReportRequest aiReportRequest){
        return aiService.generateInsights(aiReportRequest);
    }
}
