package com.example.demo.cadet.controller;

import com.example.demo.cadet.dto.CreateCadetRequest;
import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.cadet.service.CadetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cadets")
@RequiredArgsConstructor
public class CadetController {

    private final CadetRepository cadetRepository;
    private final CadetService cadetService;

    @GetMapping
    public List<Cadet> getAll() {
        return cadetRepository.findAll();
    }

    @PostMapping
    public Cadet create(@Valid @RequestBody CreateCadetRequest request) {
        return cadetService.createCadet(request);
    }
}