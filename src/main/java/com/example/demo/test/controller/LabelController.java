package com.example.demo.test.controller;

import com.example.demo.test.dto.CreateLabelRequest;
import com.example.demo.test.entity.Label;
import com.example.demo.test.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping
    public List<Label> getAll() {
        return labelService.getAll();
    }

    @PostMapping
    public Label create(@Valid @RequestBody CreateLabelRequest request) {
        return labelService.create(request);
    }
}