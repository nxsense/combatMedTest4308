package com.example.demo.scenario.entity;

import com.example.demo.scenario.enums.ExpectedActionType;
import com.example.demo.scenario.enums.MarchActionTrigger;
import com.example.demo.scenario.enums.TcccStage;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "march_action_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarchActionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tccc_stage", nullable = false)
    private TcccStage tcccStage;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ExpectedActionType actionType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "trigger_condition", nullable = false)
    private MarchActionTrigger triggerCondition;

    @Column(name = "default_critical", nullable = false)
    private Boolean defaultCritical;

    @Column(name = "default_order", nullable = false)
    private Integer defaultOrder;

    @Column(nullable = false)
    private Boolean active;
}