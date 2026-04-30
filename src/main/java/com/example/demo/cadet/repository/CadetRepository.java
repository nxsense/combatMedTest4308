package com.example.demo.cadet.repository;

import com.example.demo.cadet.entity.Cadet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CadetRepository extends JpaRepository<Cadet, Long> {
}