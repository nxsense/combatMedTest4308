package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScenarioSessionRepository extends JpaRepository<ScenarioSession, Long> {
}