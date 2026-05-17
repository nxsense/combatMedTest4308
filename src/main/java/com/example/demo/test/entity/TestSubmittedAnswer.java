package com.example.demo.test.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_submitted_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestSubmittedAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "test_result_id", nullable = false)
    private TestResult testResult;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(optional = false)
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    @Column(nullable = false)
    private Boolean correct;

    @Column(nullable = false)
    private Integer earnedPoints;
}