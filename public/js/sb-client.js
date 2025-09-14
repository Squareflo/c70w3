<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Shared Supabase client for all static HTML pages.
  // IMPORTANT: storageKey MUST match the React client in src/lib/supabase.ts
  (function initSb() {
    const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
    const SUPABASE_ANON_KEY = "REPLACE_WITH_YOUR_ANON_KEY"; // same anon key as Vercel env

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
