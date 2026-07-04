package com.swetha.aitesting.repository;

import com.swetha.aitesting.dto.ExecutionHistoryDTO;
import com.swetha.aitesting.model.TestResult;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestResultRepository
        extends JpaRepository<TestResult,Long>{

    List<TestResult>
    findByTestCaseId(Long testCaseId);

    List<TestResult>
    findTop5ByOrderByExecutionTimeDesc();

    @Modifying
    @Transactional
    @Query(
            "DELETE FROM TestResult tr WHERE tr.testCaseId = :testCaseId"
    )
    void deleteByTestCaseId(
            @Param("testCaseId")
            Long testCaseId
    );


}