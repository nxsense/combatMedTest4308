package com.example.demo.test.service;

import com.example.demo.test.dto.CreateLabelRequest;
import com.example.demo.test.entity.Label;
import com.example.demo.test.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;

    public List<Label> getAll() {
        return labelRepository.findAll();
    }

    public Label create(CreateLabelRequest request) {
        Label label = new Label();
        label.setName(request.name());

        return labelRepository.save(label);
    }
}