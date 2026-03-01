(function () {
    'use strict';

    // Supabase Configuration
    const SUPABASE_URL = 'https://afnqwcsakoqzyfxvoufh.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbnF3Y3Nha29xenlmeHZvdWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzM5OTksImV4cCI6MjA4NzYwOTk5OX0.3ra0feWH3mSDHpH7A5eACgVUUS54KDSgVTpoFfUBwZM';

    // Initialize the Supabase client
    const { createClient } = supabase;
    window._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
