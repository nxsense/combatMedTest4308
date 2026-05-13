package com.example.demo.scenario.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manipulations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Manipulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;
}