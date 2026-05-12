package com.example.demo.scenario.generator;

import com.example.demo.scenario.dto.ScenarioInjuryRequest;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.enums.ExpectedActionType;
import com.example.demo.scenario.enums.TcccStage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MarchExpectedActionGenerator {

    public List<ScenarioExpectedAction> generate(
            List<ScenarioInjuryRequest> injuries
    ) {

        List<ScenarioExpectedAction> actions =
                new ArrayList<>();

        int order = 1;

        // MARCH baseline assessment

        actions.add(
                assessment(
                        TcccStage.M,
                        "Огляд на масивну кровотечу",
                        order++,
                        true
                )
        );

        boolean hasMassiveBleeding = injuries.stream()
                .anyMatch(
                        injury ->
                                Boolean.TRUE.equals(
                                        injury.activeBleeding()
                                )
                );

        if (hasMassiveBleeding) {

            actions.add(
                    decision(
                            TcccStage.M,
                            "Визначення критичної кровотечі",
                            order++,
                            true
                    )
            );

            actions.add(
                    manipulation(
                            TcccStage.M,
                            "Контроль масивної кровотечі",
                            order++,
                            true
                    )
            );

            actions.add(
                    reassessment(
                            TcccStage.M,
                            "Перевірка ефективності контролю кровотечі",
                            order++,
                            true
                    )
            );
        }

        // A

        actions.add(
                assessment(
                        TcccStage.A,
                        "Оцінка прохідності дихальних шляхів",
                        order++,
                        true
                )
        );

        boolean airwayProblem = injuries.stream()
                .anyMatch(
                        injury ->
                                Boolean.TRUE.equals(
                                        injury.airwayCompromised()
                                )
                );

        if (airwayProblem) {

            actions.add(
                    decision(
                            TcccStage.A,
                            "Визначення проблеми дихальних шляхів",
                            order++,
                            true
                    )
            );

            actions.add(
                    manipulation(
                            TcccStage.A,
                            "Відновлення прохідності дихальних шляхів",
                            order++,
                            true
                    )
            );

            actions.add(
                    reassessment(
                            TcccStage.A,
                            "Повторна оцінка дихальних шляхів",
                            order++,
                            true
                    )
            );
        }

        // R

        actions.add(
                assessment(
                        TcccStage.R,
                        "Оцінка дихання та грудної клітки",
                        order++,
                        true
                )
        );

        boolean breathingProblem = injuries.stream()
                .anyMatch(
                        injury ->
                                Boolean.TRUE.equals(
                                        injury.breathingCompromised()
                                )
                );

        if (breathingProblem) {

            actions.add(
                    decision(
                            TcccStage.R,
                            "Визначення проблеми дихання",
                            order++,
                            true
                    )
            );

            actions.add(
                    manipulation(
                            TcccStage.R,
                            "Корекція порушення дихання",
                            order++,
                            true
                    )
            );

            actions.add(
                    reassessment(
                            TcccStage.R,
                            "Повторна оцінка дихання",
                            order++,
                            true
                    )
            );
        }

        // C

        actions.add(
                assessment(
                        TcccStage.C,
                        "Оцінка кровообігу",
                        order++,
                        false
                )
        );

        // H

        actions.add(
                assessment(
                        TcccStage.H,
                        "Профілактика гіпотермії",
                        order++,
                        false
                )
        );

        return actions;
    }

    private ScenarioExpectedAction assessment(
            TcccStage stage,
            String title,
            int order,
            boolean critical
    ) {

        return ScenarioExpectedAction.builder()
                .tcccStage(stage)
                .actionType(ExpectedActionType.ASSESSMENT)
                .title(title)
                .priorityOrder(order)
                .critical(critical)
                .build();
    }

    private ScenarioExpectedAction decision(
            TcccStage stage,
            String title,
            int order,
            boolean critical
    ) {

        return ScenarioExpectedAction.builder()
                .tcccStage(stage)
                .actionType(ExpectedActionType.DECISION)
                .title(title)
                .priorityOrder(order)
                .critical(critical)
                .build();
    }

    private ScenarioExpectedAction manipulation(
            TcccStage stage,
            String title,
            int order,
            boolean critical
    ) {

        return ScenarioExpectedAction.builder()
                .tcccStage(stage)
                .actionType(ExpectedActionType.MANIPULATION)
                .title(title)
                .priorityOrder(order)
                .critical(critical)
                .build();
    }

    private ScenarioExpectedAction reassessment(
            TcccStage stage,
            String title,
            int order,
            boolean critical
    ) {

        return ScenarioExpectedAction.builder()
                .tcccStage(stage)
                .actionType(ExpectedActionType.REASSESSMENT)
                .title(title)
                .priorityOrder(order)
                .critical(critical)
                .build();
    }
}