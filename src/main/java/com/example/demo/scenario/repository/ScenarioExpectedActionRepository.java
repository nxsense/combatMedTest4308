package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioExpectedAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioExpectedActionRepository
        extends JpaRepository<ScenarioExpectedAction, Long> {

    List<ScenarioExpectedAction> findByScenarioIdOrderByPriorityOrderAsc(Long scenarioId);
}