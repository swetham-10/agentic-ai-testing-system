package com.swetha.aitesting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionHistoryDTO {

    private Long testCaseId;

    private String title;

    private String status;

    private LocalDateTime executionTime;

    private String remarks;

}