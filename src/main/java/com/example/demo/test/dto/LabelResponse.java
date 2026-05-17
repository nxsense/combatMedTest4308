package com.example.demo.test.dto;

import java.math.BigDecimal;

public record LabelResponse(
        Long id,
        String name,
        BigDecimal criticality
) {
}