package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.Manipulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface ManipulationRepository
        extends JpaRepository<Manipulation, Long> {

    @Query("""
            SELECT DISTINCT m
            FROM Manipulation m
            JOIN m.labels l
            WHERE l.id IN :labelIds
            """)
    List<Manipulation> findByLabelIds(Set<Long> labelIds);
}