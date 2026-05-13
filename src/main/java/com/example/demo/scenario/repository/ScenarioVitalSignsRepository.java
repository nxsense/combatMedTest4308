package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioVitalSigns;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScenarioVitalSignsRepository extends JpaRepository<ScenarioVitalSigns, Long> {

    Optional<ScenarioVitalSigns> findByScenarioId(Long scenarioId);
}