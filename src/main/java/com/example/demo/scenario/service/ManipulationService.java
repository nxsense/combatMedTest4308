package com.example.demo.scenario.service;

import com.example.demo.scenario.dto.ManipulationResponse;
import com.example.demo.scenario.repository.ManipulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManipulationService {

    private final ManipulationRepository manipulationRepository;

    public List<ManipulationResponse> getAll() {
        return manipulationRepository.findAllByOrderByCodeAsc()
                .stream()
                .map(manipulation -> new ManipulationResponse(
                        manipulation.getId(),
                        manipulation.getCode(),
                        manipulation.getTitle(),
                        manipulation.getDescription()
                ))
                .toList();
    }
}