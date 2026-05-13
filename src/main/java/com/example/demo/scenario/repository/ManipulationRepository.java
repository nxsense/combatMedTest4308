package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.Manipulation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManipulationRepository
        extends JpaRepository<Manipulation, Long> {

}