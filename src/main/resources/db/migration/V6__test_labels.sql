CREATE TABLE labels (
                        id BIGSERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE test_labels (
                             test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
                             label_id BIGINT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
                             PRIMARY KEY (test_id, label_id)
);