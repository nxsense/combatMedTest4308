ALTER TABLE scenario_expected_actions
    ADD COLUMN IF NOT EXISTS manipulation_id BIGINT;

ALTER TABLE scenario_expected_actions
    DROP CONSTRAINT IF EXISTS fk_expected_action_manipulation;

ALTER TABLE scenario_expected_actions
    ADD CONSTRAINT fk_expected_action_manipulation
        FOREIGN KEY (manipulation_id)
            REFERENCES manipulations(id);