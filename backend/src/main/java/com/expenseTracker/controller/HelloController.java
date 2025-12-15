package com.expenseTracker.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HelloController {
    @GetMapping("/hello")
    public String sayHi(){
        return "Hi Loser (winner takes it all)";
    }
}
