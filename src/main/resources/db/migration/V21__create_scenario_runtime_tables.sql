create table scenario_sessions
(
    id bigserial primary key,

    scenario_id bigint not null,
    cadet_id bigint not null,

    status varchar(50) not null,

    current_minute integer,
    total_score integer,
    mistakes integer,

    started_at timestamp,
    finished_at timestamp,

    constraint fk_scenario_session_scenario
        foreign key (scenario_id)
            references training_scenarios(id),

    constraint fk_scenario_session_cadet
        foreign key (cadet_id)
            references cadets(id)
);

create table scenario_action_executions
(
    id bigserial primary key,

    session_id bigint not null,
    expected_action_id bigint not null,
    manipulation_id bigint,

    correct boolean,

    execution_minute integer,

    score_delta integer,

    notes text,

    executed_at timestamp,

    constraint fk_execution_session
        foreign key (session_id)
            references scenario_sessions(id),

    constraint fk_execution_expected_action
        foreign key (expected_action_id)
            references scenario_expected_actions(id),

    constraint fk_execution_manipulation
        foreign key (manipulation_id)
            references manipulations(id)
);