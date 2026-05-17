create table if not exists test_submitted_answers (
                                                      id bigserial primary key,
                                                      test_result_id bigint not null,
                                                      question_id bigint not null,
                                                      answer_id bigint not null,
                                                      correct boolean not null,
                                                      earned_points integer not null,

                                                      constraint fk_test_submitted_answers_result
                                                          foreign key (test_result_id)
                                                              references test_results(id)
                                                              on delete cascade,

                                                      constraint fk_test_submitted_answers_question
                                                          foreign key (question_id)
                                                              references questions(id)
                                                              on delete cascade,

                                                      constraint fk_test_submitted_answers_answer
                                                          foreign key (answer_id)
                                                              references answers(id)
                                                              on delete cascade
);


