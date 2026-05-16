package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioActionExecution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioActionExecutionRepository extends JpaRepository<ScenarioActionExecution, Long> {
    List<ScenarioActionExecution> findBySessionIdOrderByExecutionMinuteAscIdAsc(
            Long sessionId
    );
}