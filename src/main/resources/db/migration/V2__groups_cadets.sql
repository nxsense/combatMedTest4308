CREATE TABLE instructors (
                             id BIGSERIAL PRIMARY KEY,
                             user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
                             first_name VARCHAR(100) NOT NULL,
                             last_name VARCHAR(100) NOT NULL,
                             rank VARCHAR(100),
                             specialization VARCHAR(150)
);

CREATE TABLE groups (
                        id BIGSERIAL PRIMARY KEY,
                        instructor_id BIGINT REFERENCES instructors(id),
                        name VARCHAR(100) NOT NULL UNIQUE,
                        training_level VARCHAR(100),
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cadets (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
                        group_id BIGINT REFERENCES groups(id),
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        rank VARCHAR(100),
                        service_number VARCHAR(100) UNIQUE,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);