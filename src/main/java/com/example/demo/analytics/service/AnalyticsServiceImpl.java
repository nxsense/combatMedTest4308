package com.example.demo.analytics.service;

import com.example.demo.analytics.dto.*;
import com.example.demo.analytics.repository.PracticalAnalyticsRepository;
import com.example.demo.analytics.repository.TestAnalyticsRepository;
import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.instructor.repository.InstructorRepository;
import com.example.demo.scenario.enums.SessionStatus;
import com.example.demo.scenario.repository.ScenarioSessionRepository;
import com.example.demo.scenario.repository.TrainingScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PracticalAnalyticsRepository practicalAnalyticsRepository;
    private final TestAnalyticsRepository repository;
    private final CadetRepository cadetRepository;
    private final InstructorRepository instructorRepository;
    private final TrainingScenarioRepository trainingScenarioRepository;
    private final ScenarioSessionRepository scenarioSessionRepository;

    @Override
    public DashboardAnalyticsDto getDashboardAnalytics() {
        TestAnalyticsDto testAnalytics = getGeneralTestAnalytics();
        PracticalSkillAnalyticsDto practicalAnalytics = getGeneralPracticalAnalytics();

        return new DashboardAnalyticsDto(
                cadetRepository.count(),
                instructorRepository.count(),
                trainingScenarioRepository.count(),
                scenarioSessionRepository.countByStatus(SessionStatus.ACTIVE),
                scenarioSessionRepository.countByStatus(SessionStatus.COMPLETED),
                scenarioSessionRepository.countByStatus(SessionStatus.FAILED),
                scenarioSessionRepository.getAverageCompletedScenarioScore(),
                testAnalytics.totalAttempts(),
                testAnalytics.averageScore(),
                testAnalytics.passRate(),
                practicalAnalytics.totalEvaluations(),
                practicalAnalytics.averageScore(),
                practicalAnalytics.passRate()
        );
    }

    @Override
    public TestAnalyticsDto getGeneralTestAnalytics() {
        var p = repository.getGeneralAnalytics();

        return new TestAnalyticsDto(
                p.getTotalAttempts(),
                p.getAverageScore(),
                p.getPassedCount(),
                p.getFailedCount(),
                p.getPassRate()
        );
    }

    @Override
    public CadetTestAnalyticsDto getCadetTestAnalytics(Long cadetId) {
        Cadet cadet = cadetRepository.findById(cadetId)
                .orElseThrow();

        var p = repository.getAnalyticsByCadet(cadetId);

        return new CadetTestAnalyticsDto(
                cadet.getId(),
                cadet.getFirstName() + " " + cadet.getLastName(),
                p.getTotalAttempts(),
                p.getAverageScore(),
                p.getPassedCount(),
                p.getFailedCount(),
                p.getPassRate()
        );
    }

    @Override
    public List<TestLabelAnalyticsDto> getLabelAnalytics() {
        return repository.getAnalyticsByLabels()
                .stream()
                .map(p -> new TestLabelAnalyticsDto(
                        p.getLabelId(),
                        p.getLabelName(),
                        p.getAttemptsCount(),
                        p.getAverageScore(),
                        p.getPassRate()
                ))
                .toList();
    }

    @Override
    public PracticalSkillAnalyticsDto getGeneralPracticalAnalytics() {
        var p = practicalAnalyticsRepository.getGeneralPracticalAnalytics();

        return new PracticalSkillAnalyticsDto(
                p.getTotalEvaluations(),
                p.getAverageScore(),
                p.getPassedCount(),
                p.getFailedCount(),
                p.getPassRate()
        );
    }

    @Override
    public CadetPracticalSkillAnalyticsDto getCadetPracticalAnalytics(Long cadetId) {
        Cadet cadet = cadetRepository.findById(cadetId)
                .orElseThrow();

        var p = practicalAnalyticsRepository.getPracticalAnalyticsByCadet(cadetId);

        return new CadetPracticalSkillAnalyticsDto(
                cadet.getId(),
                cadet.getFirstName() + " " + cadet.getLastName(),
                p.getTotalEvaluations(),
                p.getAverageScore(),
                p.getPassedCount(),
                p.getFailedCount(),
                p.getPassRate()
        );
    }

    @Override
    public List<PracticalSkillLabelAnalyticsDto> getPracticalLabelAnalytics() {
        return practicalAnalyticsRepository.getPracticalAnalyticsByLabels()
                .stream()
                .map(p -> new PracticalSkillLabelAnalyticsDto(
                        p.getLabelId(),
                        p.getLabelName(),
                        p.getEvaluationsCount(),
                        p.getAverageScore(),
                        p.getPassRate()
                ))
                .toList();
    }

    @Override
    public List<WeakLabelAnalyticsDto> getWeakTestLabels(Long cadetId) {
        return repository.getWeakLabelsByCadet(cadetId)
                .stream()
                .map(p -> new WeakLabelAnalyticsDto(
                        p.getLabelId(),
                        p.getLabelName(),
                        p.getAverageScore(),
                        p.getAttemptsCount()
                ))
                .toList();
    }
}