ALTER TABLE groups
    DROP COLUMN instructor_id;

CREATE TABLE group_instructors (
                                   group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
                                   instructor_id BIGINT NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
                                   PRIMARY KEY (group_id, instructor_id)
);