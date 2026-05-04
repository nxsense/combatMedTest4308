package com.example.demo.test.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "answer_text")
    private String answerText;

    @Column(name = "is_correct")
    private boolean correct;

    @Column(name = "answer_order")
    private Integer answerOrder;
}