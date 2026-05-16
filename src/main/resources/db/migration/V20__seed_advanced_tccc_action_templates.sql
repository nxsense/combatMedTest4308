delete from march_action_templates;

insert into march_action_templates (
    tccc_stage,
    action_type,
    title,
    description,
    trigger_condition,
    default_critical,
    default_order,
    active,
    injury_region,
    injury_severity,
    injury_mechanism,
    min_difficulty_level,
    manipulation_id
)
values
-- SAFETY
('M', 'ASSESSMENT', 'Оцінити безпеку місця події', 'Курсант має переконатися, що місце події безпечне перед наданням допомоги.', 'ALWAYS', true, 1, true, null, null, null, 'EASY', (select id from manipulations where code = 'SAFETY_ASSESSMENT')),
('M', 'MANIPULATION', 'Одягнути рукавички', 'Курсант має використати засоби індивідуального захисту.', 'ALWAYS', false, 2, true, null, null, null, 'EASY', (select id from manipulations where code = 'GLOVES')),
('M', 'COMMUNICATION', 'Викликати допомогу', 'Курсант має ініціювати виклик допомоги або евакуації.', 'ALWAYS', false, 3, true, null, null, null, 'EASY', (select id from manipulations where code = 'CALL_FOR_HELP')),

-- M
('M', 'ASSESSMENT', 'Огляд на масивну кровотечу', 'Курсант має швидко оглянути пораненого на наявність критичної зовнішньої кровотечі.', 'ALWAYS', true, 10, true, null, null, null, 'EASY', (select id from manipulations where code = 'M_ASSESSMENT')),
('M', 'MANIPULATION', 'Накласти турнікет при кровотечі з кінцівки', 'При масивній кровотечі з кінцівки курсант має накласти турнікет.', 'ACTIVE_BLEEDING', true, 11, true, 'LOWER_LIMB', null, null, 'EASY', (select id from manipulations where code = 'TOURNIQUET')),
('M', 'MANIPULATION', 'Накласти турнікет при кровотечі з верхньої кінцівки', 'При масивній кровотечі з верхньої кінцівки курсант має накласти турнікет.', 'ACTIVE_BLEEDING', true, 12, true, 'UPPER_LIMB', null, null, 'EASY', (select id from manipulations where code = 'TOURNIQUET')),
('M', 'MANIPULATION', 'Виконати тампонаду рани', 'При кровотечі з ділянки, де турнікет неефективний, курсант має виконати тампонаду рани.', 'ACTIVE_BLEEDING', true, 13, true, 'NECK', null, null, 'MEDIUM', (select id from manipulations where code = 'WOUND_PACKING')),
('M', 'MANIPULATION', 'Застосувати гемостатичну пов’язку', 'Курсант має використати гемостатичний засіб для контролю кровотечі.', 'ACTIVE_BLEEDING', true, 14, true, null, 'SEVERE', null, 'MEDIUM', (select id from manipulations where code = 'HEMOSTATIC_DRESSING')),
('M', 'REASSESSMENT', 'Переоцінити контроль кровотечі', 'Курсант має перевірити ефективність зупинки кровотечі після втручання.', 'ACTIVE_BLEEDING', true, 15, true, null, null, null, 'EASY', (select id from manipulations where code = 'M_REASSESSMENT')),

-- A
('A', 'ASSESSMENT', 'Оцінити прохідність дихальних шляхів', 'Курсант має оцінити, чи дихальні шляхи відкриті.', 'ALWAYS', true, 20, true, null, null, null, 'EASY', (select id from manipulations where code = 'A_ASSESSMENT')),
('A', 'ASSESSMENT', 'Оцінити AVPU', 'Курсант має визначити рівень свідомості за AVPU.', 'CONSCIOUSNESS_AFFECTED', true, 21, true, null, null, null, 'EASY', (select id from manipulations where code = 'AVPU')),
('A', 'MANIPULATION', 'Відкрити дихальні шляхи маневром', 'Курсант має виконати маневр відкриття дихальних шляхів.', 'AIRWAY_COMPROMISED', true, 22, true, null, null, null, 'EASY', (select id from manipulations where code = 'AIRWAY_MANEUVER')),
('A', 'MANIPULATION', 'Встановити NPA', 'При порушенні прохідності дихальних шляхів курсант має застосувати назофарингеальний повітровід.', 'AIRWAY_COMPROMISED', true, 23, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'NPA')),
('A', 'MANIPULATION', 'Надати стабільне бокове положення', 'Курсант має розмістити пораненого у стабільне бокове положення, якщо це доречно.', 'AIRWAY_COMPROMISED', false, 24, true, null, null, null, 'EASY', (select id from manipulations where code = 'RECOVERY_POSITION')),
('A', 'REASSESSMENT', 'Переоцінити дихальні шляхи', 'Курсант має повторно оцінити дихальні шляхи після втручання.', 'AIRWAY_COMPROMISED', true, 25, true, null, null, null, 'EASY', (select id from manipulations where code = 'A_REASSESSMENT')),

-- R
('R', 'ASSESSMENT', 'Оцінити дихання і грудну клітку', 'Курсант має оцінити дихання, SpO2 та оглянути грудну клітку.', 'ALWAYS', true, 30, true, null, null, null, 'EASY', (select id from manipulations where code = 'R_ASSESSMENT')),
('R', 'MANIPULATION', 'Накласти оклюзійну наліпку', 'При проникаючому пораненні грудної клітки курсант має накласти chest seal.', 'BREATHING_COMPROMISED', true, 31, true, 'CHEST', null, 'PENETRATING_TRAUMA', 'EASY', (select id from manipulations where code = 'CHEST_SEAL')),
('R', 'DECISION', 'Оцінити потребу в голковій декомпресії', 'Курсант має визначити ознаки напруженого пневмотораксу.', 'BREATHING_COMPROMISED', true, 32, true, 'CHEST', 'SEVERE', null, 'MEDIUM', (select id from manipulations where code = 'NEEDLE_DECOMPRESSION_DECISION')),
('R', 'MANIPULATION', 'Виконати голкову декомпресію', 'При ознаках напруженого пневмотораксу курсант має виконати декомпресію.', 'BREATHING_COMPROMISED', true, 33, true, 'CHEST', 'CRITICAL', null, 'HARD', (select id from manipulations where code = 'NEEDLE_DECOMPRESSION')),
('R', 'REASSESSMENT', 'Переоцінити дихання', 'Курсант має повторно оцінити дихання після втручання.', 'BREATHING_COMPROMISED', true, 34, true, null, null, null, 'EASY', (select id from manipulations where code = 'R_REASSESSMENT')),

-- C
('C', 'ASSESSMENT', 'Оцінити кровообіг', 'Курсант має оцінити пульс, шкіру та ознаки шоку.', 'ALWAYS', false, 40, true, null, null, null, 'EASY', (select id from manipulations where code = 'C_ASSESSMENT')),
('C', 'ASSESSMENT', 'Оцінити шок', 'Курсант має визначити ознаки геморагічного або травматичного шоку.', 'SHOCK_SIGNS', true, 41, true, null, 'SEVERE', null, 'MEDIUM', (select id from manipulations where code = 'SHOCK_ASSESSMENT')),
('C', 'MANIPULATION', 'Забезпечити IV доступ', 'Курсант має забезпечити внутрішньовенний доступ, якщо це показано.', 'SHOCK_SIGNS', false, 42, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'IV_ACCESS')),
('C', 'MANIPULATION', 'Забезпечити IO доступ', 'Курсант має розглянути IO доступ, якщо IV доступ неможливий.', 'SHOCK_SIGNS', false, 43, true, null, null, null, 'HARD', (select id from manipulations where code = 'IO_ACCESS')),
('C', 'REASSESSMENT', 'Переоцінити кровообіг', 'Курсант має повторно оцінити кровообіг після втручань.', 'SHOCK_SIGNS', false, 44, true, null, null, null, 'EASY', (select id from manipulations where code = 'C_REASSESSMENT')),

-- H
('H', 'ASSESSMENT', 'Оцінити стан H', 'Курсант має оцінити гіпотермію, травму голови та інші загрози.', 'ALWAYS', false, 50, true, null, null, null, 'EASY', (select id from manipulations where code = 'H_ASSESSMENT')),
('H', 'MANIPULATION', 'Запобігти гіпотермії', 'Курсант має мінімізувати втрату тепла та ізолювати пораненого від холоду.', 'ALWAYS', false, 51, true, null, null, null, 'EASY', (select id from manipulations where code = 'HYPOTHERMIA_PREVENTION')),
('H', 'ASSESSMENT', 'Оцінити травму голови', 'При зміні свідомості курсант має оцінити можливу травму голови.', 'CONSCIOUSNESS_AFFECTED', false, 52, true, 'HEAD', null, null, 'MEDIUM', (select id from manipulations where code = 'HEAD_INJURY_ASSESSMENT')),

-- PAIN
('PAIN', 'ASSESSMENT', 'Оцінити біль', 'Курсант має оцінити рівень болю.', 'PAIN_MANAGEMENT_REQUIRED', false, 60, true, null, null, null, 'EASY', (select id from manipulations where code = 'PAIN_ASSESSMENT')),
('PAIN', 'DECISION', 'Вибрати маршрут знеболення', 'Курсант має визначити доречний маршрут знеболення відповідно до стану пораненого.', 'PAIN_MANAGEMENT_REQUIRED', false, 61, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'PAIN_ROUTE_DECISION')),
('PAIN', 'DECISION', 'Обрати IV/IO route для знеболення', 'При тяжкому стані або шоку курсант має обрати IV/IO route.', 'PAIN_IV_IO_ROUTE', false, 62, true, null, 'SEVERE', null, 'HARD', (select id from manipulations where code = 'PAIN_IV_IO_ROUTE')),
('PAIN', 'REASSESSMENT', 'Переоцінити біль', 'Курсант має переоцінити біль після втручання.', 'PAIN_MANAGEMENT_REQUIRED', false, 63, true, null, null, null, 'EASY', (select id from manipulations where code = 'PAIN_REASSESSMENT')),

-- ANTIBIOTICS
('ANTIBIOTICS', 'ASSESSMENT', 'Оцінити показання до антибіотика', 'Курсант має визначити, чи є показання до антибіотика.', 'ANTIBIOTICS_REQUIRED', false, 70, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'ANTIBIOTIC_INDICATION_ASSESSMENT')),
('ANTIBIOTICS', 'DECISION', 'Вибрати маршрут антибіотика', 'Курсант має визначити oral або parenteral route.', 'ANTIBIOTICS_REQUIRED', false, 71, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'ANTIBIOTIC_ROUTE_DECISION')),
('ANTIBIOTICS', 'DECISION', 'Обрати parenteral route антибіотика', 'При тяжкому стані курсант має обрати parenteral route.', 'ANTIBIOTICS_PARENTERAL_ROUTE', false, 72, true, null, 'SEVERE', null, 'HARD', (select id from manipulations where code = 'ANTIBIOTIC_PARENTERAL_ROUTE')),

-- WOUNDS
('WOUNDS', 'ASSESSMENT', 'Оглянути рани', 'Курсант має провести огляд ран після первинної стабілізації.', 'ALWAYS', false, 80, true, null, null, null, 'EASY', (select id from manipulations where code = 'WOUND_ASSESSMENT')),
('WOUNDS', 'MANIPULATION', 'Накласти пов’язку на рану', 'Курсант має закрити рану відповідною пов’язкою.', 'WOUND_CARE_REQUIRED', false, 81, true, null, null, null, 'EASY', (select id from manipulations where code = 'WOUND_DRESSING')),
('WOUNDS', 'MANIPULATION', 'Надати допомогу при ампутації', 'При ампутації курсант має виконати відповідний догляд за куксою та сегментом.', 'AMPUTATION_CARE_REQUIRED', true, 82, true, null, null, 'AMPUTATION', 'MEDIUM', (select id from manipulations where code = 'AMPUTATION_CARE')),

-- SPLINTING
('SPLINTING', 'ASSESSMENT', 'Оцінити перелом', 'Курсант має оцінити ознаки перелому або нестабільної кінцівки.', 'SPLINTING_REQUIRED', false, 90, true, null, null, 'BLUNT_TRAUMA', 'MEDIUM', (select id from manipulations where code = 'FRACTURE_ASSESSMENT')),
('SPLINTING', 'ASSESSMENT', 'Перевірити PMS до іммобілізації', 'Курсант має перевірити pulse, motor, sensory до іммобілізації.', 'SPLINTING_REQUIRED', false, 91, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'PMS_BEFORE_SPLINT')),
('SPLINTING', 'MANIPULATION', 'Виконати іммобілізацію', 'Курсант має стабілізувати травмовану кінцівку.', 'SPLINTING_REQUIRED', false, 92, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'SPLINTING')),
('SPLINTING', 'REASSESSMENT', 'Перевірити PMS після іммобілізації', 'Курсант має повторно перевірити pulse, motor, sensory після іммобілізації.', 'SPLINTING_REQUIRED', false, 93, true, null, null, null, 'MEDIUM', (select id from manipulations where code = 'PMS_AFTER_SPLINT')),

-- REPORTING
('H', 'COMMUNICATION', 'Передати MIST report', 'Курсант має передати MIST report.', 'ALWAYS', false, 100, true, null, null, null, 'EASY', (select id from manipulations where code = 'MIST_REPORT')),
('H', 'DOCUMENTATION', 'Заповнити DD1380', 'Курсант має задокументувати допомогу у DD1380.', 'ALWAYS', false, 101, true, null, null, null, 'EASY', (select id from manipulations where code = 'DD1380_CARD')),
('H', 'EVACUATION', 'Підготувати до евакуації', 'Курсант має підготувати пораненого до евакуації.', 'ALWAYS', false, 102, true, null, null, null, 'EASY', (select id from manipulations where code = 'EVAC_PREPARATION')),
('H', 'COMMUNICATION', 'Передати пораненого', 'Курсант має виконати handover report.', 'ALWAYS', false, 103, true, null, null, null, 'EASY', (select id from manipulations where code = 'HANDOVER_REPORT'));