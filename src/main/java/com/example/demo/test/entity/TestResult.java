package com.example.demo.test.entity;

import com.example.demo.cadet.entity.Cadet;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @ManyToOne
    @JoinColumn(name = "cadet_id", nullable = false)
    private Cadet cadet;

    private Integer score;

    private Integer maxScore;

    private BigDecimal percentage;

    private boolean passed;

    private LocalDateTime passedAt;
}