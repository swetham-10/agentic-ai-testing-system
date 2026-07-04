package com.swetha.aitesting.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardDTO {

    private long totalTestCases;

    private long passCount;

    private long failCount;

    private long totalExecutions;

    private List<?> recentExecutions;

}