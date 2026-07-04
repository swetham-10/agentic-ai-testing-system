package com.swetha.aitesting.dto;

import com.swetha.aitesting.model.TestResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalTestCases;

    private Long executedTestCases;

    private Long passCount;

    private Long failCount;

    private Long notExecutedCount;

    private List<ExecutionHistoryDTO> recentExecutions;
}