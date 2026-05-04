package com.example.demo.test.repository;

import com.example.demo.test.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface TestRepository extends JpaRepository<Test, Long> {
    @Query("""
    SELECT DISTINCT t FROM Test t
    JOIN t.labels l
    WHERE l.name IN :labels
""")
    List<Test> findByLabelNames(Set<String> labels);
}