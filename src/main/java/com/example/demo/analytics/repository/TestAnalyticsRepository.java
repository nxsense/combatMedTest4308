package com.example.demo.analytics.repository;

import com.example.demo.analytics.projection.TestAnalyticsProjection;
import com.example.demo.analytics.projection.TestLabelAnalyticsProjection;
import com.example.demo.analytics.projection.WeakLabelAnalyticsProjection;
import com.example.demo.test.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestAnalyticsRepository
        extends JpaRepository<TestResult, Long> {
    @Query(value = """
        SELECT
            COUNT(*) AS totalAttempts,
            COALESCE(AVG(tr.score), 0) AS averageScore,
            COUNT(*) FILTER (WHERE tr.passed = true) AS passedCount,
            COUNT(*) FILTER (WHERE tr.passed = false) AS failedCount,
            COALESCE(
                COUNT(*) FILTER (WHERE tr.passed = true) * 100.0
                / NULLIF(COUNT(*), 0),
                0
            ) AS passRate
        FROM test_results tr
        """, nativeQuery = true)
    TestAnalyticsProjection getGeneralAnalytics();

    @Query(value = """
        SELECT
            COUNT(*) AS totalAttempts,
            COALESCE(AVG(tr.score), 0) AS averageScore,
            COUNT(*) FILTER (WHERE tr.passed = true) AS passedCount,
            COUNT(*) FILTER (WHERE tr.passed = false) AS failedCount,
            COALESCE(
                COUNT(*) FILTER (WHERE tr.passed = true) * 100.0
                / NULLIF(COUNT(*), 0),
                0
            ) AS passRate
        FROM test_results tr
        WHERE tr.cadet_id = :cadetId
        """, nativeQuery = true)
    TestAnalyticsProjection getAnalyticsByCadet(Long cadetId);

    @Query(value = """
        SELECT
            l.id AS labelId,
            l.name AS labelName,
            COUNT(DISTINCT tr.id) AS attemptsCount,
            COALESCE(
                SUM(tsa.earned_points) * 100.0 / NULLIF(SUM(q.points), 0),
                0
            ) AS averageScore,
            COALESCE(
                COUNT(DISTINCT tr.id) FILTER (
                    WHERE tr.percentage >= 70
                ) * 100.0 / NULLIF(COUNT(DISTINCT tr.id), 0),
                0
            ) AS passRate
        FROM test_submitted_answers tsa
        JOIN test_results tr ON tr.id = tsa.test_result_id
        JOIN questions q ON q.id = tsa.question_id
        JOIN question_labels ql ON ql.question_id = q.id
        JOIN labels l ON l.id = ql.label_id
        GROUP BY l.id, l.name
        ORDER BY averageScore ASC
        """, nativeQuery = true)
    List<TestLabelAnalyticsProjection> getAnalyticsByLabels();

    @Query(value = """
        SELECT
            l.id AS labelId,
            l.name AS labelName,
            COALESCE(
                SUM(tsa.earned_points) * 100.0 / NULLIF(SUM(q.points), 0),
                0
            ) AS averageScore,
            COUNT(DISTINCT tr.id) AS attemptsCount
        FROM test_submitted_answers tsa
        JOIN test_results tr ON tr.id = tsa.test_result_id
        JOIN questions q ON q.id = tsa.question_id
        JOIN question_labels ql ON ql.question_id = q.id
        JOIN labels l ON l.id = ql.label_id
        WHERE tr.cadet_id = :cadetId
        GROUP BY l.id, l.name
        HAVING COALESCE(
            SUM(tsa.earned_points) * 100.0 / NULLIF(SUM(q.points), 0),
            0
        ) < 70
        ORDER BY averageScore ASC
        """, nativeQuery = true)
    List<WeakLabelAnalyticsProjection> getWeakLabelsByCadet(Long cadetId);
}