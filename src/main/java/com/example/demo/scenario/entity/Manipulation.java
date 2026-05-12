package com.example.demo.scenario.entity;

import com.example.demo.test.entity.Label;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "manipulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manipulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_critical", nullable = false)
    private Boolean critical;

    @ManyToMany
    @JoinTable(
            name = "manipulation_labels",
            joinColumns = @JoinColumn(name = "manipulation_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<Label> labels = new HashSet<>();
}