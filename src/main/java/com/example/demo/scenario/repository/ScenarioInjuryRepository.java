package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioInjury;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioInjuryRepository extends JpaRepository<ScenarioInjury, Long> {

    List<ScenarioInjury> findByScenarioId(Long scenarioId);
}