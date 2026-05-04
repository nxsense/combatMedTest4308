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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

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

        if (p < 60) return "FAILED";
        if (p < 75) return "PASS";
        if (p < 90) return "GOOD";
        return "EXCELLENT";
    }
    @Transactional
    public void submit(SubmitPracticalResultRequest request) {

        PracticalSkill skill = practicalSkillRepository.findById(request.skillId())
                .orElseThrow();

        Cadet cadet = cadetRepository.findById(request.cadetId())
                .orElseThrow();

        Instructor instructor = instructorRepository.findById(request.instructorId())
                .orElseThrow();

        PracticalResult result = new PracticalResult();
        result.setSkill(skill);
        result.setCadet(cadet);
        result.setInstructor(instructor);
        result.setCompletedAt(LocalDateTime.now());
        result.setComment(request.comment());

        List<PracticalStepEvaluation> evaluations = request.steps().stream()
                .map(s -> {
                    PracticalStep step = practicalStepRepository.findById(s.stepId())
                            .orElseThrow();

                    PracticalStepEvaluation eval = new PracticalStepEvaluation();
                    eval.setResult(result);
                    eval.setStep(step);
                    eval.setStatus(s.status());
                    eval.setScore(s.score());
                    eval.setComment(s.comment());
                    return eval;
                })
                .toList();

        int totalScore = evaluations.stream()
                .mapToInt(PracticalStepEvaluation::getScore)
                .sum();

        int maxScore = skill.getSteps().stream()
                .mapToInt(PracticalStep::getMaxScore)
                .sum();

        BigDecimal percentage = BigDecimal.valueOf(totalScore)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(maxScore), 2, RoundingMode.HALF_UP);

        result.setTotalScore(totalScore);
        result.setMaxScore(maxScore);
        result.setPercentage(percentage);
        result.setResultStatus(resolveStatus(percentage));

        result.setEvaluations(evaluations);

        practicalResultRepository.save(result);
    }

    @Transactional
    public void createSkill(CreatePracticalSkillRequest request) {

        PracticalSkill skill = new PracticalSkill();
        skill.setName(request.name());
        skill.setDescription(request.description());

        // labels
        Set<Label> labels = new HashSet<>(
                labelRepository.findAllById(request.labelIds())
        );
        skill.setLabels(labels);

        // steps
        List<PracticalStep> steps = request.steps().stream()
                .map(s -> {
                    PracticalStep step = new PracticalStep();
                    step.setSkill(skill); // важливо!
                    step.setStepOrder(s.order());
                    step.setStepName(s.name());
                    step.setDescription(s.description());
                    step.setMaxScore(s.maxScore());
                    step.setCritical(s.critical());
                    return step;
                })
                .toList();

        skill.setSteps(steps);

        // maxScore рахуємо автоматично
        int maxScore = steps.stream()
                .mapToInt(PracticalStep::getMaxScore)
                .sum();

        skill.setMaxScore(maxScore);

        practicalSkillRepository.save(skill);
    }

    public List<PracticalSkill> getAllSkills() {
        return practicalSkillRepository.findAll();
    }

    public PracticalSkill getSkillById(Long id) {
        return practicalSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practical skill not found"));
    }

    public List<PracticalResult> getAllResults() {
        return practicalResultRepository.findAll();
    }

    public List<PracticalResult> getResultsByCadet(Long cadetId) {
        return practicalResultRepository.findByCadetId(cadetId);
    }

    public List<WeakLabelResponse> getWeakLabels(Long cadetId) {

        List<PracticalResult> results =
                practicalResultRepository.findByCadetId(cadetId);

        Map<String, List<BigDecimal>> labelStats = new HashMap<>();

        for (PracticalResult result : results) {
            for (Label label : result.getSkill().getLabels()) {
                labelStats.putIfAbsent(label.getName(), new ArrayList<>());
                labelStats.get(label.getName()).add(result.getPercentage());
            }
        }

        return labelStats.entrySet().stream()
                .map(entry -> {
                    BigDecimal avg = entry.getValue().stream()
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
                            .divide(BigDecimal.valueOf(entry.getValue().size()), 2, RoundingMode.HALF_UP);

                    double priority = 1 - avg.doubleValue() / 100.0;

                    return new WeakLabelResponse(
                            entry.getKey(),
                            avg.doubleValue(),
                            priority
                    );
                })
                .filter(l -> l.averageScore() < 70)
                .sorted((a, b) -> Double.compare(b.priority(), a.priority()))
                .toList();
    }
}