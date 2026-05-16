package com.example.demo.scenario.controller;

import com.example.demo.scenario.dto.ManipulationResponse;
import com.example.demo.scenario.service.ManipulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manipulations")
@RequiredArgsConstructor
public class ManipulationController {

    private final ManipulationService manipulationService;

    @GetMapping
    public List<ManipulationResponse> getAllManipulations() {
        return manipulationService.getAll();
    }
}