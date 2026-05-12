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
            COUNT(tr.id) AS attemptsCount,
            COALESCE(AVG(tr.score), 0) AS averageScore,
            COALESCE(
                COUNT(*) FILTER (WHERE tr.passed = true) * 100.0
                / NULLIF(COUNT(*), 0),
                0
            ) AS passRate
        FROM test_results tr
        JOIN tests t ON tr.test_id = t.id
        JOIN test_labels tl ON tl.test_id = t.id
        JOIN labels l ON l.id = tl.label_id
        GROUP BY l.id, l.name
        ORDER BY averageScore ASC
        """, nativeQuery = true)
    List<TestLabelAnalyticsProjection> getAnalyticsByLabels();

    @Query(value = """
        SELECT
            l.id AS labelId,
            l.name AS labelName,
            COALESCE(AVG(tr.score), 0) AS averageScore,
            COUNT(tr.id) AS attemptsCount
        FROM test_results tr
        JOIN tests t
            ON tr.test_id = t.id
        JOIN test_labels tl
            ON tl.test_id = t.id
        JOIN labels l
            ON l.id = tl.label_id
        WHERE tr.cadet_id = :cadetId
        GROUP BY l.id, l.name
        HAVING AVG(tr.score) < 60
        ORDER BY averageScore ASC
        """, nativeQuery = true)
    List<WeakLabelAnalyticsProjection>
    getWeakLabelsByCadet(Long cadetId);
}