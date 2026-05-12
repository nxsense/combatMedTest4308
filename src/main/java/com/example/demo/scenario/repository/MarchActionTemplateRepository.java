package com.example.demo.scenario.repository;

import com.example.demo.scenario.entity.MarchActionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarchActionTemplateRepository
        extends JpaRepository<MarchActionTemplate, Long> {

    List<MarchActionTemplate> findByActiveTrueOrderByDefaultOrderAsc();
}