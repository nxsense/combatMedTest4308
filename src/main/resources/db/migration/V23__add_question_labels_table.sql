create table if not exists question_labels (
                                               question_id bigint not null,
                                               label_id bigint not null,

                                               primary key (question_id, label_id),

                                               constraint fk_question_labels_question
                                                   foreign key (question_id)
                                                       references questions(id)
                                                       on delete cascade,

                                               constraint fk_question_labels_label
                                                   foreign key (label_id)
                                                       references labels(id)
                                                       on delete cascade
);

create index if not exists idx_question_labels_question_id
    on question_labels(question_id);

create index if not exists idx_question_labels_label_id
    on question_labels(label_id);

