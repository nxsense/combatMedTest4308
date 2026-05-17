package com.example.demo.practical.service;

import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.repository.InstructorRepository;
import com.example.demo.practical.dto.CreatePracticalSkillRequest;
import com.example.demo.practical.dto.SubmitPracticalResultRequest;
import com.example.demo.practical.dto.WeakLabelResponse;
import com.example.demo.practical.entity.PracticalResult;
import com.example.demo.practical.entity.PracticalSkill;
import com.example.demo.practical.entity.PracticalStep;
import com.example.demo.practical.entity.PracticalStepEvaluation;
import com.example.demo.practical.repository.PracticalResultRepository;
import com.example.demo.practical.repository.PracticalSkillRepository;
import com.example.demo.practical.repository.PracticalStepRepository;
import com.example.demo.test.entity.Label;
import com.example.demo.test.repository.LabelRepository;
import com.example.demo.practical.dto.PracticalSkillResponse;
import com.example.demo.practical.dto.PracticalStepResponse;
import java.util.Comparator;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PracticalService {

    private final PracticalSkillRepository practicalSkillRepository;
    private final PracticalStepRepository practicalStepRepository;
    private final PracticalResultRepository practicalResultRepository;
    private final CadetRepository cadetRepository;
    private final InstructorRepository instructorRepository;
    private final LabelRepository labelRepository;

    private String resolveStatus(BigDecimal percentage) {
        double p = percentage.doubleValue();

        if (p < 60) {
            return "FAILED";
        }

        if (p < 75) {
            return "PASS";
        }

        if (p < 90) {
            return "GOOD";
        }

        return "EXCELLENT";
    }

    @Transactional
    public PracticalSkillResponse createSkill(CreatePracticalSkillRequest request) {
        validateCreateRequest(request);

        PracticalSkill skill = new PracticalSkill();
        skill.setName(request.name().trim());
        skill.setDescription(request.description().trim());

        Set<Label> labels = new HashSet<>();

        if (request.labelIds() != null && !request.labelIds().isEmpty()) {
            labels.addAll(labelRepository.findAllById(request.labelIds()));
        }

        skill.setLabels(labels);

        List<PracticalStep> steps = request.steps()
                .stream()
                .map(stepRequest -> {
                    PracticalStep step = new PracticalStep();

                    step.setSkill(skill);
                    step.setStepOrder(stepRequest.stepOrder());
                    step.setStepName(stepRequest.title().trim());
                    step.setDescription(stepRequest.description().trim());
                    step.setCritical(Boolean.TRUE.equals(stepRequest.critical()));
                    step.setMaxScore(Boolean.TRUE.equals(stepRequest.critical()) ? 20 : 10);

                    return step;
                })
                .toList();

        int maxScore = steps.stream()
                .mapToInt(PracticalStep::getMaxScore)
                .sum();

        skill.setMaxScore(maxScore);
        skill.setSteps(steps);

        PracticalSkill saved = practicalSkillRepository.save(skill);

        return toResponse(saved);
    }

    @Transactional
    public void submit(SubmitPracticalResultRequest request) {
        PracticalSkill skill = practicalSkillRepository.findById(request.skillId())
                .orElseThrow(() -> new RuntimeException("Practical skill not found"));

        Cadet cadet = cadetRepository.findById(request.cadetId())
                .orElseThrow(() -> new RuntimeException("Cadet not found"));

        Instructor instructor = instructorRepository.findById(request.instructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        PracticalResult result = new PracticalResult();
        result.setSkill(skill);
        result.setCadet(cadet);
        result.setInstructor(instructor);
        result.setCompletedAt(LocalDateTime.now());
        result.setComment(request.comment());

        List<PracticalStepEvaluation> evaluations = request.steps()
                .stream()
                .map(submittedStep -> {
                    PracticalStep step = practicalStepRepository.findById(submittedStep.stepId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Practical step not found: " + submittedStep.stepId()
                            ));

                    PracticalStepEvaluation evaluation = new PracticalStepEvaluation();
                    evaluation.setResult(result);
                    evaluation.setStep(step);
                    evaluation.setStatus(submittedStep.status());
                    evaluation.setScore(submittedStep.score());
                    evaluation.setComment(submittedStep.comment());

                    return evaluation;
                })
                .toList();

        int totalScore = evaluations.stream()
                .mapToInt(evaluation -> evaluation.getScore() == null ? 0 : evaluation.getScore())
                .sum();

        int maxScore = skill.getSteps()
                .stream()
                .mapToInt(step -> step.getMaxScore() == null ? 0 : step.getMaxScore())
                .sum();

        BigDecimal percentage = maxScore == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(totalScore)
                  .multiply(BigDecimal.valueOf(100))
                  .divide(BigDecimal.valueOf(maxScore), 2, RoundingMode.HALF_UP);

        result.setTotalScore(totalScore);
        result.setMaxScore(maxScore);
        result.setPercentage(percentage);
        result.setResultStatus(resolveStatus(percentage));
        result.setEvaluations(evaluations);

        practicalResultRepository.save(result);
    }

    @Transactional(readOnly = true)
    public List<PracticalSkillResponse> getAllSkills() {
        return practicalSkillRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PracticalSkillResponse getSkillById(Long id) {
        PracticalSkill skill = practicalSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practical skill not found"));

        return toResponse(skill);
    }

    public List<PracticalResult> getAllResults() {
        return practicalResultRepository.findAll();
    }

    public List<PracticalResult> getResultsByCadet(Long cadetId) {
        return practicalResultRepository.findByCadetId(cadetId);
    }

    public List<WeakLabelResponse> getWeakLabels(Long cadetId) {
        List<PracticalResult> results = practicalResultRepository.findByCadetId(cadetId);

        Map<String, List<BigDecimal>> labelStats = new HashMap<>();

        for (PracticalResult result : results) {
            for (Label label : result.getSkill().getLabels()) {
                labelStats.putIfAbsent(label.getName(), new ArrayList<>());
                labelStats.get(label.getName()).add(result.getPercentage());
            }
        }

        return labelStats.entrySet()
                .stream()
                .map(entry -> {
                    BigDecimal avg = entry.getValue()
                            .stream()
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
                            .divide(
                                    BigDecimal.valueOf(entry.getValue().size()),
                                    2,
                                    RoundingMode.HALF_UP
                            );

                    double priority = 1 - avg.doubleValue() / 100.0;

                    return new WeakLabelResponse(
                            entry.getKey(),
                            avg.doubleValue(),
                            priority
                    );
                })
                .filter(label -> label.averageScore() < 70)
                .sorted((a, b) -> Double.compare(b.priority(), a.priority()))
                .toList();
    }

    private void validateCreateRequest(CreatePracticalSkillRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Practical skill name is required");
        }

        if (request.description() == null || request.description().isBlank()) {
            throw new IllegalArgumentException("Practical skill description is required");
        }

        if (request.steps() == null || request.steps().isEmpty()) {
            throw new IllegalArgumentException("At least one practical step is required");
        }

        boolean invalidStep = request.steps()
                .stream()
                .anyMatch(step ->
                        step.title() == null
                                || step.title().isBlank()
                                || step.description() == null
                                || step.description().isBlank()
                                || step.stepOrder() == null
                                || step.stepOrder() <= 0
                );

        if (invalidStep) {
            throw new IllegalArgumentException(
                    "Each practical step must have title, description and valid order"
            );
        }
    }

    public PracticalSkillResponse toResponse(PracticalSkill skill) {
        Set<String> labels = skill.getLabels() == null
                ? Set.of()
                : skill.getLabels()
                  .stream()
                  .map(Label::getName)
                  .collect(Collectors.toSet());

        List<PracticalStepResponse> steps = skill.getSteps() == null
                ? List.of()
                : skill.getSteps()
                  .stream()
                  .sorted(Comparator.comparing(
                          PracticalStep::getStepOrder,
                          Comparator.nullsLast(Integer::compareTo)
                  ))
                  .map(step -> new PracticalStepResponse(
                          step.getId(),
                          step.getStepName(),
                          step.getDescription(),
                          step.getStepOrder(),
                          step.getCritical(),
                          step.getMaxScore()
                  ))
                  .toList();

        return new PracticalSkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getDescription(),
                skill.getMaxScore(),
                labels,
                steps
        );
    }
}