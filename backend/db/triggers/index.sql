-- Main trigger file that includes all triggers

-- First, drop any existing triggers and functions to avoid conflicts
\i 'drop_all.sql'

-- Include all trigger files in the correct order
\i 'activity_logging.sql'
\i 'security_triggers.sql'
\i 'validation_triggers.sql'

-- Verify triggers are created
SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY 
    event_object_table,
    trigger_name; 