CREATE TABLE march_action_templates (
                                        id BIGSERIAL PRIMARY KEY,

                                        tccc_stage VARCHAR(50) NOT NULL,
                                        action_type VARCHAR(50) NOT NULL,

                                        title VARCHAR(255) NOT NULL,
                                        description TEXT,

                                        trigger_condition VARCHAR(100) NOT NULL,
                                        default_critical BOOLEAN NOT NULL DEFAULT FALSE,
                                        default_order INT NOT NULL,

                                        active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO march_action_templates
(tccc_stage, action_type, title, description, trigger_condition, default_critical, default_order)
VALUES
    ('M', 'ASSESSMENT', 'Огляд на масивну кровотечу', 'Курсант має перевірити наявність критичної зовнішньої кровотечі.', 'ALWAYS', true, 1),

    ('M', 'DECISION', 'Визначення критичної кровотечі', 'Курсант має визначити, чи є кровотеча пріоритетною загрозою.', 'ACTIVE_BLEEDING', true, 2),

    ('M', 'MANIPULATION', 'Контроль масивної кровотечі', 'Курсант має виконати відповідну маніпуляцію для контролю кровотечі.', 'ACTIVE_BLEEDING', true, 3),

    ('M', 'REASSESSMENT', 'Перевірка ефективності контролю кровотечі', 'Курсант має перевірити, чи кровотечу зупинено.', 'ACTIVE_BLEEDING', true, 4),

    ('A', 'ASSESSMENT', 'Оцінка прохідності дихальних шляхів', 'Курсант має оцінити прохідність дихальних шляхів.', 'ALWAYS', true, 5),

    ('A', 'DECISION', 'Визначення проблеми дихальних шляхів', 'Курсант має визначити наявність проблеми з прохідністю дихальних шляхів.', 'AIRWAY_COMPROMISED', true, 6),

    ('A', 'MANIPULATION', 'Відновлення прохідності дихальних шляхів', 'Курсант має виконати дію для відновлення прохідності дихальних шляхів.', 'AIRWAY_COMPROMISED', true, 7),

    ('A', 'REASSESSMENT', 'Повторна оцінка дихальних шляхів', 'Курсант має повторно оцінити стан дихальних шляхів після втручання.', 'AIRWAY_COMPROMISED', true, 8),

    ('R', 'ASSESSMENT', 'Оцінка дихання та грудної клітки', 'Курсант має оцінити дихання та оглянути грудну клітку.', 'ALWAYS', true, 9),

    ('R', 'DECISION', 'Визначення проблеми дихання', 'Курсант має визначити наявність порушення дихання.', 'BREATHING_COMPROMISED', true, 10),

    ('R', 'MANIPULATION', 'Корекція порушення дихання', 'Курсант має виконати відповідну дію для корекції порушення дихання.', 'BREATHING_COMPROMISED', true, 11),

    ('R', 'REASSESSMENT', 'Повторна оцінка дихання', 'Курсант має повторно оцінити дихання після втручання.', 'BREATHING_COMPROMISED', true, 12),

    ('C', 'ASSESSMENT', 'Оцінка кровообігу', 'Курсант має оцінити ознаки порушення кровообігу.', 'ALWAYS', false, 13),

    ('H', 'ASSESSMENT', 'Профілактика гіпотермії', 'Курсант має забезпечити профілактику гіпотермії.', 'ALWAYS', false, 14);