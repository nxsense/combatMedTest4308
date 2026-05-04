package com.example.demo.practical.repository;

import com.example.demo.practical.entity.PracticalStep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticalStepRepository extends JpaRepository<PracticalStep, Long> {
}