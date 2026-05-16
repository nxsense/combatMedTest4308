package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.ScenarioSession;
import com.example.demo.scenario.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ScenarioSessionRepository extends JpaRepository<ScenarioSession, Long> {

    long countByStatus(SessionStatus status);

    @Query("""
            select coalesce(avg(s.totalScore), 0)
            from ScenarioSession s
            where s.status = com.example.demo.scenario.enums.SessionStatus.COMPLETED
              and s.totalScore is not null
            """)
    double getAverageCompletedScenarioScore();
}