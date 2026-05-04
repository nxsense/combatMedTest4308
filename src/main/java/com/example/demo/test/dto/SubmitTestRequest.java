package com.example.demo.test.dto;

import java.util.List;

public record SubmitTestRequest(
        Long cadetId,
        List<SubmittedAnswerRequest> answers
) {
}