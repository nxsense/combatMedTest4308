package com.example.demo.test.controller;

import com.example.demo.test.dto.CreateLabelRequest;
import com.example.demo.test.dto.LabelResponse;
import com.example.demo.test.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping
    public List<LabelResponse> getAllLabels() {
        return labelService.getAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public LabelResponse createLabel(@RequestBody CreateLabelRequest request) {
        return labelService.create(request);
    }
}