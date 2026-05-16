package com.example.demo.auth.service;

import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.RegisterRequest;
import com.example.demo.role.entity.Role;
import com.example.demo.role.repository.RoleRepository;
import com.example.demo.security.JwtService;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.repository.InstructorRepository;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Set<String> ALLOWED_REGISTRATION_ROLES =
            Set.of("CADET", "INSTRUCTOR");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CadetRepository cadetRepository;
    private final InstructorRepository instructorRepository;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole().getName()
        );

        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        String roleName = normalizeRole(request.role());

        if (!ALLOWED_REGISTRATION_ROLES.contains(roleName)) {
            throw new IllegalArgumentException("Only CADET or INSTRUCTOR registration is allowed");
        }

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already taken");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        createProfileForRole(saved, roleName);

        String token = jwtService.generateToken(
                saved.getUsername(),
                saved.getRole().getName()
        );

        return new AuthResponse(token);
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (request.password() == null || request.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "CADET";
        }

        String normalized = role.trim().toUpperCase();

        if (normalized.startsWith("ROLE_")) {
            return normalized.substring(5);
        }

        return normalized;
    }

    private void createProfileForRole(User user, String roleName) {
        if ("INSTRUCTOR".equals(roleName)) {
            Instructor instructor = new Instructor();
            instructor.setUser(user);
            instructor.setFirstName(user.getUsername());
            instructor.setLastName("");
            instructor.setRank("");
            instructor.setSpecialization("");
            instructorRepository.save(instructor);
            return;
        }

        if ("CADET".equals(roleName)) {
            Cadet cadet = new Cadet();
            cadet.setUser(user);
            cadet.setFirstName(user.getUsername());
            cadet.setLastName("");
            cadet.setRank("");
            cadet.setServiceNumber("");
            cadetRepository.save(cadet);
        }
    }
}