package com.example.demo.test.service;

import com.example.demo.test.dto.CreateLabelRequest;
import com.example.demo.test.dto.LabelResponse;
import com.example.demo.test.entity.Label;
import com.example.demo.test.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;

    public List<LabelResponse> getAll() {
        return labelRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public LabelResponse create(CreateLabelRequest request) {
        validate(request);

        String name = request.name().trim();

        if (labelRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Label already exists: " + name);
        }

        Label label = new Label();
        label.setName(name);
        label.setCriticality(normalizeCriticality(request.criticality()));

        return toResponse(labelRepository.save(label));
    }

    private void validate(CreateLabelRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Label name is required");
        }
    }

    private BigDecimal normalizeCriticality(BigDecimal criticality) {
        if (criticality == null) {
            return BigDecimal.ONE;
        }

        if (criticality.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }

        if (criticality.compareTo(BigDecimal.TEN) > 0) {
            return BigDecimal.TEN;
        }

        return criticality;
    }

    private LabelResponse toResponse(Label label) {
        return new LabelResponse(
                label.getId(),
                label.getName(),
                label.getCriticality()
        );
    }
}