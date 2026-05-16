ALTER TABLE march_action_templates
    ADD COLUMN IF NOT EXISTS manipulation_id BIGINT;

ALTER TABLE march_action_templates
    DROP CONSTRAINT IF EXISTS fk_march_action_template_manipulation;

ALTER TABLE march_action_templates
    ADD CONSTRAINT fk_march_action_template_manipulation
        FOREIGN KEY (manipulation_id)
            REFERENCES manipulations(id);