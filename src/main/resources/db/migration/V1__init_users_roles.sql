CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description TEXT
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       role_id BIGINT NOT NULL REFERENCES roles(id),
                       username VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       is_active BOOLEAN NOT NULL DEFAULT true,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
                                          ('ADMIN', 'Адміністратор'),
                                          ('INSTRUCTOR', 'Інструктор'),
                                          ('COMBAT MEDIC', 'Курсант'),
                                          ('ANALYST', 'Аналітик');