package com.example.demo.instructor.dto;

public record UpdateInstructorRequest(
        String firstName,
        String lastName,
        String rank,
        String specialization
) {
}