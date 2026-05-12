package com.example.demo.analytics.repository;

import com.example.demo.analytics.projection.PracticalSkillAnalyticsProjection;
import com.example.demo.analytics.projection.PracticalSkillLabelAnalyticsProjection;
import com.example.demo.practical.entity.PracticalResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PracticalAnalyticsRepository
        extends JpaRepository<PracticalResult, Long> {

    @Query(value = """
            SELECT
                COUNT(*) AS totalEvaluations,
                COALESCE(AVG(pr.percentage), 0) AS averageScore,
                COUNT(*) FILTER (
                    WHERE pr.result_status = 'PASSED'
                ) AS passedCount,
                COUNT(*) FILTER (
                    WHERE pr.result_status = 'FAILED'
                ) AS failedCount,
                COALESCE(
                    COUNT(*) FILTER (
                        WHERE pr.result_status = 'PASSED'
                    ) * 100.0
                    / NULLIF(COUNT(*), 0),
                    0
                ) AS passRate
            FROM practical_results pr
            """, nativeQuery = true)
    PracticalSkillAnalyticsProjection getGeneralPracticalAnalytics();

    @Query(value = """
            SELECT
                COUNT(*) AS totalEvaluations,
                COALESCE(AVG(pr.percentage), 0) AS averageScore,
                COUNT(*) FILTER (
                    WHERE pr.result_status = 'PASSED'
                ) AS passedCount,
                COUNT(*) FILTER (
                    WHERE pr.result_status = 'FAILED'
                ) AS failedCount,
                COALESCE(
                    COUNT(*) FILTER (
                        WHERE pr.result_status = 'PASSED'
                    ) * 100.0
                    / NULLIF(COUNT(*), 0),
                    0
                ) AS passRate
            FROM practical_results pr
            WHERE pr.cadet_id = :cadetId
            """, nativeQuery = true)
    PracticalSkillAnalyticsProjection getPracticalAnalyticsByCadet(
            Long cadetId
    );

    @Query(value = """
            SELECT
                l.id AS labelId,
                l.name AS labelName,
                COUNT(pr.id) AS evaluationsCount,
                COALESCE(AVG(pr.percentage), 0) AS averageScore,
                COALESCE(
                    COUNT(*) FILTER (
                        WHERE pr.result_status = 'PASSED'
                    ) * 100.0
                    / NULLIF(COUNT(*), 0),
                    0
                ) AS passRate
            FROM practical_results pr
            JOIN practical_skills ps
                ON pr.skill_id = ps.id
            JOIN practical_skill_labels psl
                ON psl.skill_id = ps.id
            JOIN labels l
                ON l.id = psl.label_id
            GROUP BY l.id, l.name
            ORDER BY averageScore ASC
            """, nativeQuery = true)
    List<PracticalSkillLabelAnalyticsProjection>
    getPracticalAnalyticsByLabels();
}