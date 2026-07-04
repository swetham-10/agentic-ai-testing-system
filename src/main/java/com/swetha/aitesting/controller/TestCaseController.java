package com.swetha.aitesting.controller;

import com.swetha.aitesting.model.TestCase;
import com.swetha.aitesting.model.TestResult;
import com.swetha.aitesting.repository.TestCaseRepository;
import com.swetha.aitesting.repository.TestResultRepository;
import com.swetha.aitesting.service.TestCaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")

public class TestCaseController {

    @Autowired
    private TestCaseRepository testCaseRepo;

    @Autowired
    private TestResultRepository resultRepo;

    @Autowired
    private TestCaseService service;


    // Save test case
    @PostMapping("/save")
    public Object save(
            @RequestBody TestCase testCase
    ){

        try{

            return service.save(testCase);

        }
        catch(Exception e){

            Map<String,String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return error;

        }

    }


    // Duplicate prevention
    @PostMapping("/testcase")
    public Map<String,Object> saveTestCase(
            @RequestBody TestCase testCase
    ){

        List<TestCase> existing =

                testCaseRepo
                        .findAllByTitleAndDescriptionAndStepsAndExpectedResult(
                                testCase.getTitle(),
                                testCase.getDescription(),
                                testCase.getSteps(),
                                testCase.getExpectedResult()
                        );

        Map<String,Object> response =
                new HashMap<>();

        if(!existing.isEmpty()){

            response.put(
                    "message",
                    "Test Case Already Exists"
            );

            response.put(
                    "duplicate",
                    true
            );

            return response;

        }

        TestCase saved =
                testCaseRepo.save(testCase);

        response.put(
                "duplicate",
                false
        );

        response.put(
                "data",
                saved
        );

        return response;

    }


    // Execute test
    @PostMapping("/execute")
    public TestResult executeTest(
            @RequestBody TestResult result
    ){

        result.setExecutionTime(
                LocalDateTime.now()
        );

        return resultRepo.save(result);

    }


    // History
    @GetMapping("/execution/{testCaseId}")
    public List<TestResult> history(
            @PathVariable Long testCaseId
    ){

        return resultRepo
                .findByTestCaseId(
                        testCaseId
                );

    }

    // Get all test cases
    @GetMapping("/testcases")
    public List<TestCase> getAllTestCases() {

        return testCaseRepo.findAll();

    }

    @GetMapping("/testcase/{id}")
    public TestCase getTestCase(
            @PathVariable Long id
    ) {

        return testCaseRepo
                .findById(id)
                .orElse(null);

    }

    @PutMapping("/testcase/{id}")
    public TestCase updateTestCase(

            @PathVariable Long id,

            @RequestBody TestCase updated

    ) {

        TestCase existing =
                testCaseRepo
                        .findById(id)
                        .orElse(null);

        if (existing == null) {

            return null;

        }

        existing.setTitle(
                updated.getTitle()
        );

        existing.setDescription(
                updated.getDescription()
        );

        existing.setSteps(
                updated.getSteps()
        );

        existing.setExpectedResult(
                updated.getExpectedResult()
        );

        existing.setPriority(
                updated.getPriority()
        );

        return testCaseRepo.save(
                existing
        );

    }

//    @DeleteMapping("/testcase/{id}")
//    public void deleteTestCase(
//            @PathVariable Long id
//    ) {
//
//        testCaseRepo.deleteById(id);
//
//    }

//    @DeleteMapping("/testcase/{id}")
//    public void deleteTestCase(
//            @PathVariable Long id
//    ) {
//
//        resultRepo.deleteByTestCaseId(id);
//
//        testCaseRepo.deleteById(id);
//
//    }
@DeleteMapping("/testcase/{id}")
public void deleteTestCase(
        @PathVariable Long id
) {

    System.out.println(
            "Deleting results for testcase = " + id
    );

    resultRepo.deleteByTestCaseId(id);

    System.out.println(
            "Results deleted"
    );

    testCaseRepo.deleteById(id);

    System.out.println(
            "Test case deleted"
    );
}


}