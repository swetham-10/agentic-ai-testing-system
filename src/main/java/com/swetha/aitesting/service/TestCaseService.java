package com.swetha.aitesting.service;

import com.swetha.aitesting.model.TestCase;
import com.swetha.aitesting.repository.TestCaseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestCaseService {

    @Autowired
    private TestCaseRepository repo;

    public TestCase save(TestCase testCase){

        List<TestCase> existing =

                repo
                        .findAllByTitleAndDescriptionAndStepsAndExpectedResult(

                                testCase.getTitle(),
                                testCase.getDescription(),
                                testCase.getSteps(),
                                testCase.getExpectedResult()

                        );

        if(!existing.isEmpty()){

            throw new RuntimeException(
                    "Duplicate Test Case Already Exists"
            );

        }

        return repo.save(testCase);

    }

}