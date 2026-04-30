package com.example.demo.cadet.entity;

import com.example.demo.group.entity.Group;
import com.example.demo.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cadets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cadet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    private String firstName;
    private String lastName;
    private String rank;
    private String serviceNumber;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}