package com.example.demo.test.repository;

import com.example.demo.test.entity.TestSubmittedAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestSubmittedAnswerRepository extends JpaRepository<TestSubmittedAnswer, Long> {
}