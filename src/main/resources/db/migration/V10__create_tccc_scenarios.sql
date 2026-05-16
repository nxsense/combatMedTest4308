CREATE TABLE manipulations (
                               id BIGSERIAL PRIMARY KEY,
                               name VARCHAR(255) NOT NULL,
                               description TEXT,
                               is_critical BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE manipulation_labels (
                                     manipulation_id BIGINT NOT NULL,
                                     label_id BIGINT NOT NULL,

                                     PRIMARY KEY (manipulation_id, label_id),

                                     CONSTRAINT fk_manipulation_labels_manipulation
                                         FOREIGN KEY (manipulation_id)
                                             REFERENCES manipulations(id)
                                             ON DELETE CASCADE,

                                     CONSTRAINT fk_manipulation_labels_label
                                         FOREIGN KEY (label_id)
                                             REFERENCES labels(id)
                                             ON DELETE CASCADE
);

CREATE TABLE training_scenarios (
                                    id BIGSERIAL PRIMARY KEY,
                                    title VARCHAR(255) NOT NULL,
                                    legend TEXT NOT NULL,
                                    scenario_flow_notes TEXT,
                                    difficulty_level VARCHAR(50) NOT NULL,
                                    source VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_scenario_labels (
                                          scenario_id BIGINT NOT NULL,
                                          label_id BIGINT NOT NULL,

                                          PRIMARY KEY (scenario_id, label_id),

                                          CONSTRAINT fk_training_scenario_labels_scenario
                                              FOREIGN KEY (scenario_id)
                                                  REFERENCES training_scenarios(id)
                                                  ON DELETE CASCADE,

                                          CONSTRAINT fk_training_scenario_labels_label
                                              FOREIGN KEY (label_id)
                                                  REFERENCES labels(id)
                                                  ON DELETE CASCADE
);

CREATE TABLE scenario_injuries (
                                   id BIGSERIAL PRIMARY KEY,
                                   scenario_id BIGINT NOT NULL,

                                   mechanism VARCHAR(50) NOT NULL,
                                   region VARCHAR(50) NOT NULL,
                                   severity VARCHAR(50) NOT NULL,

                                   active_bleeding BOOLEAN NOT NULL DEFAULT FALSE,
                                   airway_compromised BOOLEAN NOT NULL DEFAULT FALSE,
                                   breathing_compromised BOOLEAN NOT NULL DEFAULT FALSE,
                                   consciousness_affected BOOLEAN NOT NULL DEFAULT FALSE,

                                   description TEXT,

                                   CONSTRAINT fk_scenario_injuries_scenario
                                       FOREIGN KEY (scenario_id)
                                           REFERENCES training_scenarios(id)
                                           ON DELETE CASCADE
);

CREATE TABLE scenario_vital_signs (
                                      id BIGSERIAL PRIMARY KEY,
                                      scenario_id BIGINT NOT NULL UNIQUE,

                                      heart_rate INT,
                                      systolic_bp INT,
                                      diastolic_bp INT,
                                      respiratory_rate INT,
                                      spo2 INT,
                                      consciousness_level VARCHAR(255),
                                      skin_condition VARCHAR(255),
                                      pain_level INT,

                                      CONSTRAINT fk_scenario_vital_signs_scenario
                                          FOREIGN KEY (scenario_id)
                                              REFERENCES training_scenarios(id)
                                              ON DELETE CASCADE
);

CREATE TABLE scenario_expected_actions (
                                           id BIGSERIAL PRIMARY KEY,
                                           scenario_id BIGINT NOT NULL,
                                           manipulation_id BIGINT,

                                           tccc_stage VARCHAR(50) NOT NULL,
                                           action_type VARCHAR(50) NOT NULL,

                                           title VARCHAR(255) NOT NULL,
                                           description TEXT,

                                           priority_order INT NOT NULL,
                                           critical BOOLEAN NOT NULL DEFAULT FALSE,
                                           rationale TEXT,

                                           CONSTRAINT fk_expected_actions_scenario
                                               FOREIGN KEY (scenario_id)
                                                   REFERENCES training_scenarios(id)
                                                   ON DELETE CASCADE,

                                           CONSTRAINT fk_expected_actions_manipulation
                                               FOREIGN KEY (manipulation_id)
                                                   REFERENCES manipulations(id)
                                                   ON DELETE SET NULL
);

CREATE INDEX idx_training_scenario_labels_label
    ON training_scenario_labels(label_id);

CREATE INDEX idx_scenario_injuries_scenario
    ON scenario_injuries(scenario_id);

CREATE INDEX idx_scenario_expected_actions_scenario
    ON scenario_expected_actions(scenario_id);

CREATE INDEX idx_scenario_expected_actions_tccc_stage
    ON scenario_expected_actions(tccc_stage);

CREATE INDEX idx_manipulation_labels_label
    ON manipulation_labels(label_id);