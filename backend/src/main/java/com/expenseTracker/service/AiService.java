package com.expenseTracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AiService {

    @Value("${hf.api.url}")
    private String apiURL;

    @Value("${hf.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String generateInsights(Object userPayload){

        String payloadJson;
        try {
            payloadJson = mapper.writeValueAsString(userPayload);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize AI payload", e);
        }

        Map<String, Object> systemMessage = Map.of(
            "role", "system",
            "content",
        "You are a financial analysis AI." +
            "Analyze the user's monthly expenses and generate insights." +
            "Use ₹ symbol for currency." +
            "Return each insight on a new line." +
           " Do not use symbols like *, -, • or markdown." +
            "Only plain sentences separated by newline." +
            "Do NOT return JSON."
        );
        Map<String, Object> userMessage = Map.of(
                "role","user",
                "content", payloadJson
        );
        Map <String, Object> body = new HashMap<>();
        body.put("model", "meta-llama/Llama-3.1-8B-Instruct");
        body.put("messages", List.of(systemMessage, userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken);

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiURL, request, Map.class);

        List choices = (List) Objects.requireNonNull(response.getBody()).get("choices");
        Map firstChoice = (Map) choices.get(0);
        Map message = (Map) firstChoice.get("message");

        return message.get("content").toString().trim();
    }
}
