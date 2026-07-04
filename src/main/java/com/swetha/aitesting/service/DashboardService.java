package com.swetha.aitesting.service;

import com.swetha.aitesting.dto.DashboardResponse;
import com.swetha.aitesting.dto.ExecutionHistoryDTO;
import com.swetha.aitesting.model.TestCase;
import com.swetha.aitesting.model.TestResult;
import com.swetha.aitesting.repository.TestCaseRepository;
import com.swetha.aitesting.repository.TestResultRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private TestCaseRepository testCaseRepo;

    @Autowired
    private TestResultRepository resultRepo;

    public DashboardResponse getDashboardData() {

        long totalTestCases =
                testCaseRepo.count();

        List<TestResult> allResults =
                resultRepo.findAll();

        Map<Long, TestResult> latestResults =
                new HashMap<>();

        for (TestResult result : allResults) {

            Long testCaseId =
                    result.getTestCaseId();

            if (!latestResults.containsKey(testCaseId)
                    ||
                    result.getId() >
                            latestResults
                                    .get(testCaseId)
                                    .getId()) {

                latestResults.put(
                        testCaseId,
                        result
                );
            }
        }

        long executedTestCases =
                latestResults.size();

        long passCount =
                latestResults.values()
                        .stream()
                        .filter(r ->
                                "PASS".equalsIgnoreCase(
                                        r.getStatus()))
                        .count();

        long failCount =
                latestResults.values()
                        .stream()
                        .filter(r ->
                                "FAIL".equalsIgnoreCase(
                                        r.getStatus()))
                        .count();

        List<ExecutionHistoryDTO> recentExecutions =

                resultRepo.findTop5ByOrderByExecutionTimeDesc()

                        .stream()

                        .map(result -> {

                            TestCase tc =
                                    testCaseRepo.findById(
                                            result.getTestCaseId()
                                    ).orElse(null);

                            return new ExecutionHistoryDTO(

                                    result.getTestCaseId(),

                                    tc != null
                                            ? tc.getTitle()
                                            : "Unknown Test",

                                    result.getStatus(),

                                    result.getExecutionTime(),

                                    result.getRemarks()

                            );

                        })

                        .toList();

        long notExecutedCount =
                totalTestCases - executedTestCases;

        return new DashboardResponse(
                totalTestCases,
                executedTestCases,
                passCount,
                failCount,
                notExecutedCount,
                recentExecutions
        );
    }

    public List<ExecutionHistoryDTO> getExecutionHistory() {

        return resultRepo
                .findAll()

                .stream()

                .map(result -> {

                    TestCase tc =
                            testCaseRepo.findById(
                                    result.getTestCaseId()
                            ).orElse(null);

                    if (tc == null) {

                        return null;

                    }

                    return new ExecutionHistoryDTO(

                            result.getTestCaseId(),

                            tc.getTitle(),

                            result.getStatus(),

                            result.getExecutionTime(),

                            result.getRemarks()

                    );

                })

                .filter(Objects::nonNull)

                .sorted((a, b) ->

                        b.getExecutionTime()
                                .compareTo(
                                        a.getExecutionTime()
                                )
                )

                .toList();
    }
}