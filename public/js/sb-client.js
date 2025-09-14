<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Shared Supabase client for all static HTML pages.
  // IMPORTANT: storageKey MUST match the React client in src/lib/supabase.ts
  (function initSb() {
    const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaGZzZGZhb2J4cG9xYWdobnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTE3NDgsImV4cCI6MjA3MzM2Nzc0OH0.FTyOvpYlb_6EiZnSe3S29vkbmIyw0ayHJHN6Gjt6_zw"; // same anon key as Vercel env

    if (!window.__sb) {
      window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "sb-chowlocal-auth",
        },
      });
    }
    window.sb = window.__sb; // expose for page scripts
  })();
</script>
