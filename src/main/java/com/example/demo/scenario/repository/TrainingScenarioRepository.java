package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.TrainingScenario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingScenarioRepository
        extends JpaRepository<TrainingScenario, Long> {
}