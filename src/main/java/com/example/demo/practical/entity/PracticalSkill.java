package com.example.demo.practical.entity;

import com.example.demo.test.entity.Label;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "practical_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PracticalSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Column(name = "max_score")
    private Integer maxScore;

    @ManyToMany
    @JoinTable(
            name = "practical_skill_labels",
            joinColumns = @JoinColumn(name = "skill_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<Label> labels = new HashSet<>();

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PracticalStep> steps;
}