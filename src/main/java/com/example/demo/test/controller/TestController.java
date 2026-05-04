package com.example.demo.test.controller;

import com.example.demo.test.dto.*;
import com.example.demo.test.entity.Test;
import com.example.demo.test.entity.TestResult;
import com.example.demo.test.repository.TestRepository;
import com.example.demo.test.repository.TestResultRepository;
import com.example.demo.test.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final TestRepository testRepository;
    private final TestResultRepository testResultRepository;

    @GetMapping
    public List<TestResponse> getAll() {
        return testRepository.findAll()
                .stream()
                .map(testService::toTestResponse)
                .toList();
    }

    @PostMapping
    public TestResponse create(@RequestBody CreateTestRequest request) {
        return testService.toTestResponse(testService.createTest(request));
    }

    @PostMapping("/{testId}/submit")
    public TestResult submit(
            @PathVariable Long testId,
            @RequestBody SubmitTestRequest request
    ) {
        return testService.submitTest(testId, request);
    }
    @GetMapping("/results")
    public List<TestResultResponse> getAllResults() {
        return testResultRepository.findAll()
                .stream()
                .map(testService::toResultResponse)
                .toList();
    }

    @GetMapping("/results/cadet/{cadetId}")
    public List<TestResultResponse> getResultsByCadet(@PathVariable Long cadetId) {
        return testResultRepository.findByCadetId(cadetId)
                .stream()
                .map(testService::toResultResponse)
                .toList();
    }

    @GetMapping("/results/test/{testId}")
    public List<TestResultResponse> getResultsByTest(@PathVariable Long testId) {
        return testResultRepository.findByTestId(testId)
                .stream()
                .map(testService::toResultResponse)
                .toList();
    }

    @GetMapping("/analytics/cadet/{cadetId}")
    public CadetAnalyticsResponse getCadetAnalytics(@PathVariable Long cadetId) {
        return testService.getCadetAnalytics(cadetId);
    }


    @GetMapping("/recommended/cadet/{cadetId}")
    public List<RecommendedTestResponse> getRecommended(@PathVariable Long cadetId) {
        return testService.getRecommendedTests(cadetId);
    }
}