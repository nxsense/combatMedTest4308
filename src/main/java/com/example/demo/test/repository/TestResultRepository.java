package com.example.demo.test.repository;

import com.example.demo.test.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByCadetId(Long cadetId);

    List<TestResult> findByTestId(Long testId);
}