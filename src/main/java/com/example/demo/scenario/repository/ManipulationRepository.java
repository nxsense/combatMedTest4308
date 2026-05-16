package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.Manipulation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManipulationRepository extends JpaRepository<Manipulation, Long> {

    List<Manipulation> findAllByOrderByCodeAsc();
}