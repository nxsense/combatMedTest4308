CREATE TABLE tests (
                       id BIGSERIAL PRIMARY KEY,
                       title VARCHAR(150) NOT NULL,
                       description TEXT,
                       max_score INT NOT NULL DEFAULT 0,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
                           id BIGSERIAL PRIMARY KEY,
                           test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
                           question_text TEXT NOT NULL,
                           points INT NOT NULL DEFAULT 1,
                           question_order INT NOT NULL
);

CREATE TABLE answers (
                         id BIGSERIAL PRIMARY KEY,
                         question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                         answer_text TEXT NOT NULL,
                         is_correct BOOLEAN NOT NULL DEFAULT false,
                         answer_order INT NOT NULL
);

CREATE TABLE test_results (
                              id BIGSERIAL PRIMARY KEY,
                              test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
                              cadet_id BIGINT NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
                              score INT NOT NULL,
                              max_score INT NOT NULL,
                              percentage DECIMAL(5,2) NOT NULL,
                              passed BOOLEAN NOT NULL,
                              passed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);