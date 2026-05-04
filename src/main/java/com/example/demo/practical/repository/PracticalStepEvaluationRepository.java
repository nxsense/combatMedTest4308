package com.example.demo.practical.repository;

import com.example.demo.practical.entity.PracticalStepEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalStepEvaluationRepository extends JpaRepository<PracticalStepEvaluation, Long> {

    List<PracticalStepEvaluation> findByResultId(Long resultId);
}