package com.example.demo.test.service;

import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.config.RecommendationProperties;
import com.example.demo.test.dto.*;
import com.example.demo.test.entity.*;
import com.example.demo.test.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final LabelRepository labelRepository;
    private final CadetRepository cadetRepository;
    private final AnswerRepository answerRepository;
    private final TestResultRepository testResultRepository;
    private final RecommendationProperties weights;
    private final TestSubmittedAnswerRepository submittedAnswerRepository;
    private final QuestionRepository questionRepository;

    public Test createTest(CreateTestRequest request) {

        Test test = new Test();

        test.setTitle(request.title());
        test.setDescription(request.description());
        test.setDifficulty(normalizeDifficulty(request.difficulty()));
        test.setCreatedAt(LocalDateTime.now());

        // labels
        if (request.labelIds() != null) {
            test.setLabels(new HashSet<>(labelRepository.findAllById(request.labelIds())));
        }

        int totalScore = 0;

        // questions
        for (CreateQuestionRequest qReq : request.questions()) {
            Question question = new Question();
            question.setTest(test);
            question.setQuestionText(qReq.questionText());
            question.setPoints(qReq.points());
            question.setQuestionOrder(qReq.questionOrder());

            if (qReq.labelIds() != null && !qReq.labelIds().isEmpty()) {
                question.setLabels(new HashSet<>(labelRepository.findAllById(qReq.labelIds())));
            }

            for (CreateAnswerRequest aReq : qReq.answers()) {
                Answer answer = new Answer();
                answer.setQuestion(question);
                answer.setAnswerText(aReq.answerText());
                answer.setCorrect(aReq.correct());
                answer.setAnswerOrder(aReq.answerOrder());
                question.getAnswers().add(answer);
            }

            test.getQuestions().add(question);
            totalScore += qReq.points();
        }

        test.setMaxScore(totalScore);

        return testRepository.save(test);
    }

    public TestResult submitTest(Long testId, SubmitTestRequest request) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        Cadet cadet = cadetRepository.findById(request.cadetId())
                .orElseThrow(() -> new RuntimeException("Cadet not found"));

        int score = 0;

        for (SubmittedAnswerRequest submitted : request.answers()) {
            Answer answer = answerRepository.findById(submitted.answerId())
                    .orElseThrow(() -> new RuntimeException("Answer not found"));

            if (answer.isCorrect()) {
                score += answer.getQuestion().getPoints();
            }
        }

        int maxScore = test.getMaxScore();
        BigDecimal percentage = BigDecimal.valueOf(score * 100.0 / maxScore)
                .setScale(2, RoundingMode.HALF_UP);

        TestResult result = new TestResult();
        result.setTest(test);
        result.setCadet(cadet);
        result.setScore(score);
        result.setMaxScore(maxScore);
        result.setPercentage(percentage);
        result.setPassed(percentage.compareTo(BigDecimal.valueOf(70)) >= 0);
        result.setPassedAt(LocalDateTime.now());

        TestResult savedResult = testResultRepository.save(result);

        List<TestSubmittedAnswer> submittedAnswers = request.answers()
                .stream()
                .map(submitted -> {
                    Question question = questionRepository.findById(submitted.questionId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Question not found: " + submitted.questionId()
                            ));

                    Answer answer = answerRepository.findById(submitted.answerId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Answer not found: " + submitted.answerId()
                            ));

                    boolean correct = answer.isCorrect();
                    int earnedPoints = correct ? question.getPoints() : 0;

                    TestSubmittedAnswer submittedAnswer = new TestSubmittedAnswer();
                    submittedAnswer.setTestResult(savedResult);
                    submittedAnswer.setQuestion(question);
                    submittedAnswer.setAnswer(answer);
                    submittedAnswer.setCorrect(correct);
                    submittedAnswer.setEarnedPoints(earnedPoints);

                    return submittedAnswer;
                })
                .toList();

        submittedAnswerRepository.saveAll(submittedAnswers);

        return savedResult;
    }

    public TestResultResponse toResultResponse(TestResult result) {
        return new TestResultResponse(
                result.getId(),
                result.getTest().getId(),
                result.getTest().getTitle(),
                result.getCadet().getId(),
                result.getCadet().getFirstName() + " " + result.getCadet().getLastName(),
                result.getScore(),
                result.getMaxScore(),
                result.getPercentage(),
                result.isPassed(),
                result.getPassedAt()
        );
    }

    public TestResponse toTestResponse(Test test) {
        return new TestResponse(
                test.getId(),
                test.getTitle(),
                test.getDescription(),
                test.getMaxScore(),
                test.getCreatedAt(),
                test.getLabels().stream()
                        .map(Label::getName)
                        .collect(Collectors.toSet()),
                test.getQuestions()
                        .stream()
                        .map(question -> new QuestionResponse(
                                question.getId(),
                                question.getQuestionText(),
                                question.getPoints(),
                                question.getQuestionOrder(),
                                question.getLabels()
                                        .stream()
                                        .map(Label::getName)
                                        .collect(Collectors.toSet()),
                                question.getAnswers()
                                        .stream()
                                        .map(answer -> new AnswerResponse(
                                                answer.getId(),
                                                answer.getAnswerText(),
                                                answer.isCorrect(),
                                                answer.getAnswerOrder()
                                        ))
                                        .toList()
                        ))
                        .toList()
        );
    }

    public CadetAnalyticsResponse getCadetAnalytics(Long cadetId) {

        List<TestResult> results = testResultRepository.findByCadetId(cadetId);

        if (results.isEmpty()) {
            throw new RuntimeException("No results for cadet");
        }

        // середній %
        BigDecimal avg = results.stream()
                .map(TestResult::getPercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(results.size()), 2, RoundingMode.HALF_UP);

        // label → (correct / total)
        Map<String, List<BigDecimal>> labelStats = new HashMap<>();

        for (TestResult result : results) {
            Test test = result.getTest();

            for (Label label : test.getLabels()) {
                labelStats.putIfAbsent(label.getName(), new ArrayList<>());
                labelStats.get(label.getName()).add(result.getPercentage());
            }
        }

        Map<String, BigDecimal> labelPerformance = new HashMap<>();

        List<String> weakLabels = labelPerformance.entrySet().stream()
                .filter(entry -> entry.getValue().compareTo(BigDecimal.valueOf(70)) < 0)
                .map(Map.Entry::getKey)
                .toList();

        List<String> recommendations = weakLabels.stream()
                .map(label -> "Рекомендується повторити тему: " + label)
                .toList();

        for (var entry : labelStats.entrySet()) {
            BigDecimal labelAvg = entry.getValue().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(entry.getValue().size()), 2, RoundingMode.HALF_UP);

            labelPerformance.put(entry.getKey(), labelAvg);
        }

        Cadet cadet = cadetRepository.findById(cadetId)
                .orElseThrow();

        return new CadetAnalyticsResponse(
                cadetId,
                cadet.getFirstName() + " " + cadet.getLastName(),
                avg,
                labelPerformance,
                weakLabels,
                recommendations
        );
    }

    public List<RecommendedTestResponse> getRecommendedTests(Long cadetId) {

        CadetAnalyticsResponse analytics = getCadetAnalytics(cadetId);

        List<String> weakLabels = analytics.weakLabels();

        if (weakLabels.isEmpty()) {
            return List.of();
        }

        List<Test> tests = testRepository.findByLabelNames(Set.copyOf(weakLabels));

        return tests.stream()
                .map(test -> {
                    double score = test.getLabels().stream()
                            .filter(l -> weakLabels.contains(l.getName()))
                            .count();

                    return new RecommendedTestResponse(
                            test.getId(),
                            test.getTitle(),
                            score,
                            "Рекомендовано через слабкі теми"
                    );
                })
                .sorted((a, b) -> Double.compare(b.priorityScore(), a.priorityScore()))
                .limit(5)
                .toList();
    }
    private BigDecimal difficultyWeight(String difficulty) {
        return switch (difficulty) {
            case "EASY" -> BigDecimal.valueOf(0.5);
            case "HARD" -> BigDecimal.valueOf(1.0);
            default -> BigDecimal.valueOf(0.75);
        };
    }

    private double calculatePriorityScore(Test test,
                                          Map<String, BigDecimal> labelPerformance) {

        double totalScore = 0.0;

        for (Label label : test.getLabels()) {

            BigDecimal performance = labelPerformance.get(label.getName());

            if (performance == null) continue;

            // x1 = 1 - P/100
            double x1 = 1 - performance.doubleValue() / 100.0;

            // x2 = difficulty
            double x2 = difficultyWeight(test.getDifficulty()).doubleValue();

            // x3 = criticality (нормалізуємо)
            double x3 = label.getCriticality().doubleValue() / 2.0;

            double score = weights.getProblem() * x1
                    + weights.getDifficulty() * x2
                    + weights.getCriticality() * x3;

            totalScore += score;
        }

        return totalScore;
    }

    private String normalizeDifficulty(String difficulty) {
        if (difficulty == null || difficulty.isBlank()) {
            return "MEDIUM";
        }

        String normalized = difficulty.trim().toUpperCase();

        if (!Set.of("EASY", "MEDIUM", "HARD").contains(normalized)) {
            return "MEDIUM";
        }

        return normalized;
    }
}