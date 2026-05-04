package com.example.demo.instructor.service;

import com.example.demo.instructor.dto.CreateInstructorRequest;
import com.example.demo.instructor.dto.UpdateInstructorRequest;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.repository.InstructorRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository instructorRepository;
    private final UserRepository userRepository;

    public List<Instructor> getAll() {
        return instructorRepository.findAll();
    }

    public Instructor getById(Long id) {
        return instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
    }

    public Instructor create(CreateInstructorRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Instructor instructor = new Instructor();
        instructor.setUser(user);
        instructor.setFirstName(request.firstName());
        instructor.setLastName(request.lastName());
        instructor.setRank(request.rank());
        instructor.setSpecialization(request.specialization());

        return instructorRepository.save(instructor);
    }

    public Instructor update(Long id, UpdateInstructorRequest request) {
        Instructor instructor = getById(id);

        instructor.setFirstName(request.firstName());
        instructor.setLastName(request.lastName());
        instructor.setRank(request.rank());
        instructor.setSpecialization(request.specialization());

        return instructorRepository.save(instructor);
    }

    public void delete(Long id) {
        Instructor instructor = getById(id);
        instructorRepository.delete(instructor);
    }
}