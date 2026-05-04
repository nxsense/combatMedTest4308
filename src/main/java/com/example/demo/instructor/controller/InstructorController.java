package com.example.demo.instructor.controller;

import com.example.demo.instructor.dto.CreateInstructorRequest;
import com.example.demo.instructor.dto.UpdateInstructorRequest;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.service.InstructorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instructors")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @GetMapping
    public List<Instructor> getAll() {
        return instructorService.getAll();
    }

    @GetMapping("/{id}")
    public Instructor getById(@PathVariable Long id) {
        return instructorService.getById(id);
    }

    @PostMapping
    public Instructor create(@Valid @RequestBody CreateInstructorRequest request) {
        return instructorService.create(request);
    }

    @PutMapping("/{id}")
    public Instructor update(
            @PathVariable Long id,
            @RequestBody UpdateInstructorRequest request
    ) {
        return instructorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        instructorService.delete(id);
    }
}