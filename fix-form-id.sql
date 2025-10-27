-- Исправление типа колонки form_id с varchar на integer
-- Выполните этот SQL скрипт напрямую в PostgreSQL

-- Для таблицы pages_blocks_contact_form
ALTER TABLE pages_blocks_contact_form 
ALTER COLUMN form_id TYPE integer USING (
  CASE 
    WHEN form_id ~ '^[0-9]+$' THEN form_id::integer
    ELSE NULL
  END
);

-- Для таблицы версий (если существует)
ALTER TABLE _pages_v_blocks_contact_form 
ALTER COLUMN form_id TYPE integer USING (
  CASE 
    WHEN form_id ~ '^[0-9]+$' THEN form_id::integer
    ELSE NULL
  END
);
