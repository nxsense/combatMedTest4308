alter table march_action_templates
    add column if not exists injury_region varchar(50);

alter table march_action_templates
    add column if not exists injury_severity varchar(50);

alter table march_action_templates
    add column if not exists injury_mechanism varchar(50);

alter table march_action_templates
    add column if not exists min_difficulty_level varchar(50);

alter table march_action_templates
    add column if not exists manipulation_id bigint;

do $$
    begin
        if not exists (
            select 1
            from information_schema.table_constraints
            where constraint_name = 'fk_march_action_template_manipulation'
        ) then

            alter table march_action_templates
                add constraint fk_march_action_template_manipulation
                    foreign key (manipulation_id)
                        references manipulations(id);

        end if;
    end $$;