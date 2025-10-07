-- Create live_updates table to store broadcastable events
CREATE TABLE IF NOT EXISTS public.live_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  event text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Function to insert into live_updates and emit a NOTIFY payload
CREATE OR REPLACE FUNCTION public.fn_log_live_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a record into live_updates for auditing
  INSERT INTO public.live_updates (table_name, event, payload)
  VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW)::jsonb);

  -- Send a lightweight notify payload so listeners can react immediately
  PERFORM pg_notify('live_updates', json_build_object(
    'table', TG_TABLE_NAME,
    'event', TG_OP,
    'record', row_to_json(NEW)
  )::text);

  RETURN NEW;
END;
$$;

-- Example: attach the trigger function to the `entries` table
-- Replace `entries` with the table you want to monitor (e.g., `profiles`, `entries`, `submissions`)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'entries') THEN
    BEGIN
      EXECUTE 'DROP TRIGGER IF EXISTS trg_live_updates ON public.entries';
      EXECUTE 'CREATE TRIGGER trg_live_updates
        AFTER INSERT OR UPDATE ON public.entries
        FOR EACH ROW
        EXECUTE FUNCTION public.fn_log_live_update()';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Could not create trigger on public.entries: %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE 'Table public.entries not found; please replace entries with your target table and re-run this script.';
  END IF;
END$$;
