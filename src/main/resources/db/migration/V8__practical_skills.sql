CREATE TABLE practical_skills (
                                  id BIGSERIAL PRIMARY KEY,
                                  name VARCHAR(150) NOT NULL,
                                  description TEXT,
                                  max_score INT NOT NULL DEFAULT 0
);

CREATE TABLE practical_skill_labels (
                                        skill_id BIGINT NOT NULL REFERENCES practical_skills(id) ON DELETE CASCADE,
                                        label_id BIGINT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
                                        PRIMARY KEY (skill_id, label_id)
);

CREATE TABLE practical_steps (
                                 id BIGSERIAL PRIMARY KEY,
                                 skill_id BIGINT NOT NULL REFERENCES practical_skills(id) ON DELETE CASCADE,
                                 step_order INT NOT NULL,
                                 step_name VARCHAR(150) NOT NULL,
                                 description TEXT,
                                 max_score INT NOT NULL,
                                 is_critical BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE practical_results (
                                   id BIGSERIAL PRIMARY KEY,
                                   skill_id BIGINT NOT NULL REFERENCES practical_skills(id),
                                   cadet_id BIGINT NOT NULL REFERENCES cadets(id),
                                   instructor_id BIGINT NOT NULL REFERENCES instructors(id),
                                   total_score INT NOT NULL,
                                   max_score INT NOT NULL,
                                   percentage DECIMAL(5,2) NOT NULL,
                                   result_status VARCHAR(30) NOT NULL,
                                   comment TEXT,
                                   completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE practical_step_evaluations (
                                            id BIGSERIAL PRIMARY KEY,
                                            result_id BIGINT NOT NULL REFERENCES practical_results(id) ON DELETE CASCADE,
                                            step_id BIGINT NOT NULL REFERENCES practical_steps(id),
                                            status VARCHAR(30) NOT NULL,
                                            score INT NOT NULL,
                                            comment TEXT
);