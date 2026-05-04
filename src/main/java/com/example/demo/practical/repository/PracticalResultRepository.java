package com.example.demo.practical.repository;

import com.example.demo.practical.entity.PracticalResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalResultRepository extends JpaRepository<PracticalResult, Long> {

    List<PracticalResult> findByCadetId(Long cadetId);

    List<PracticalResult> findBySkillId(Long skillId);
}