package com.example.demo.test.controller;

import com.example.demo.test.dto.*;
import com.example.demo.test.entity.TestResult;
import com.example.demo.test.repository.TestRepository;
import com.example.demo.test.repository.TestResultRepository;
import com.example.demo.test.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public TestResponse create(@RequestBody CreateTestRequest request) {
        return testService.toTestResponse(testService.createTest(request));
    }

    @PostMapping("/{testId}/submit")
    public TestResultResponse submit(
            @PathVariable Long testId,
            @RequestBody SubmitTestRequest request
    ) {
        TestResult result = testService.submitTest(testId, request);
        return testService.toResultResponse(result);
    }

    @GetMapping("/results")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public List<?> getAllResults() {
        return testResultRepository.findAll()
                .stream()
                .map(testService::toResultResponse)
                .toList();
    }

    @GetMapping("/results/cadet/{cadetId}")
    public List<?> getResultsByCadet(@PathVariable Long cadetId) {
        return testResultRepository.findByCadetId(cadetId)
                .stream()
                .map(testService::toResultResponse)
                .toList();
    }

    @GetMapping("/results/test/{testId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public List<?> getResultsByTest(@PathVariable Long testId) {
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
    public List<?> getRecommended(@PathVariable Long cadetId) {
        return testService.getRecommendedTests(cadetId);
    }
}