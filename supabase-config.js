const SUPABASE_URL = 'https://epklfkzyscrcbgqjzpej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa2xma3p5c2NyY2JncWp6cGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDg1NzAsImV4cCI6MjA5NDEyNDU3MH0.EMmVKp1E-34mYDZ5LTl94AhuzDpgxlp261CTJAcrO4E';

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);