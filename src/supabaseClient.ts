
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzsqpvccwxzerfsbdfvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6c3FwdmNjd3h6ZXJmc2JkZnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODYwOTcsImV4cCI6MjA4NDg2MjA5N30.ZV8bSC10ldfBhmYCqOdkSMuUVpaIxxx3vtH9Zf7rTsQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
