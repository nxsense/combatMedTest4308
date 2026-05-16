ALTER TABLE march_action_templates
    ADD COLUMN injury_region VARCHAR(64);

ALTER TABLE march_action_templates
    ADD COLUMN injury_severity VARCHAR(64);

ALTER TABLE march_action_templates
    ADD COLUMN injury_mechanism VARCHAR(64);

ALTER TABLE march_action_templates
    ADD COLUMN min_difficulty_level VARCHAR(32);