package com.example.demo.cadet.repository;

import com.example.demo.cadet.entity.Cadet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CadetRepository extends JpaRepository<Cadet, Long> {

    Optional<Cadet> findByUserId(Long userId);
}