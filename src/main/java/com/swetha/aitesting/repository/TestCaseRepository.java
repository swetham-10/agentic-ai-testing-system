package com.swetha.aitesting.repository;

import com.swetha.aitesting.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository
        extends JpaRepository<TestCase,Long>{

    List<TestCase>
    findAllByTitleAndDescriptionAndStepsAndExpectedResult(

            String title,
            String description,
            String steps,
            String expectedResult

    );

    List<TestCase> findAllByTitleAndDescription(
            String title,
            String description
    );

}