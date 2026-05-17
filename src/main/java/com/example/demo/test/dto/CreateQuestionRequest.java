package com.example.demo.test.dto;

import java.util.List;
import java.util.Set;

public record CreateQuestionRequest(
        String questionText,
        Integer points,
        Integer questionOrder,
        Set<Long> labelIds,
        List<CreateAnswerRequest> answers
) {
}