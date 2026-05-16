ALTER TABLE manipulations
    ADD COLUMN IF NOT EXISTS title VARCHAR(255);

UPDATE manipulations
SET title = name
WHERE title IS NULL;

ALTER TABLE manipulations
    ALTER COLUMN title SET NOT NULL;