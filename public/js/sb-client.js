<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  (function initSb() {
    const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaGZzZGZhb2J4cG9xYWdobnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTE3NDgsImV4cCI6MjA3MzM2Nzc0OH0.FTyOvpYlb_6EiZnSe3S29vkbmIyw0ayHJHN6Gjt6_zw"; // must be the real anon key

    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("REPLACE_WITH")) {
      console.error("[sb-client] Missing anon key in /public/js/sb-client.js");
    }

    // Avoid re-creating
    if (!window.__sb) {
      window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "sb-chowlocal-auth", // must match src/lib/supabase.ts
        },
      });
    }
    window.sb = window.__sb;

    // Helpful debugging hooks
    sb.auth.onAuthStateChange((e, session) => {
      console.log("[sb] auth event:", e, session);
    });

    (async () => {
      const { data, error } = await sb.auth.getSession();
      if (error) console.error("[sb] getSession error:", error);
      else console.log("[sb] initial session:", data?.session);
    })();
  })();
</script>
