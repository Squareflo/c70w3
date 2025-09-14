<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Configure once for all static HTML pages.
  // Must match your React singleton storageKey to share sessions across pages.
  (function initSb() {
    const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
    const SUPABASE_ANON_KEY = "REPLACE_WITH_YOUR_ANON_KEY"; // same anon key you use in Vercel envs

    // Avoid double-creating a client if multiple scripts run on the same page
    if (!window.__sb) {
      window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // IMPORTANT: match your React client's storageKey in src/lib/supabase.ts
          storageKey: "sb-chowlocal-auth",
        },
      });
    }
    window.sb = window.__sb;
  })();
</script>
