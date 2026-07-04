package com.swetha.aitesting.controller;

import com.swetha.aitesting.dto.DashboardResponse;
import com.swetha.aitesting.dto.ExecutionHistoryDTO;
import com.swetha.aitesting.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")

public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardResponse dashboard() {

        return dashboardService
                .getDashboardData();
    }

    @GetMapping("/execution-history")
    public List<ExecutionHistoryDTO> getExecutionHistory() {

        return dashboardService
                .getExecutionHistory();
    }
}