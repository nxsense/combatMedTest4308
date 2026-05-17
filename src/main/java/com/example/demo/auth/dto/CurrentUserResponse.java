package com.example.demo.auth.dto;

public record CurrentUserResponse(
        Long userId,
        String username,
        String email,
        String role,
        Long cadetId,
        Long instructorId
) {
}