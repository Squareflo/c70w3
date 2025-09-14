// public/js/sb-client.js
// Shared Supabase client for static HTML pages (SEO pages).
// IMPORTANT: storageKey must match src/lib/supabase.ts so sessions are shared.

(function initSb() {
  const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaGZzZGZhb2J4cG9xYWdobnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTE3NDgsImV4cCI6MjA3MzM2Nzc0OH0.FTyOvpYlb_6EiZnSe3S29vkbmIyw0ayHJHN6Gjt6_zw";

  if (!SUPABASE_ANON_KEY) {
    console.error("[sb-client] Missing anon key in /public/js/sb-client.js");
  }

  // Avoid re-creating if already initialized
  if (!window.__sb) {
    // `supabase` global is provided by the CDN we load in each HTML page
    window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "sb-chowlocal-auth",
      },
    });
  }
  window.sb = window.__sb;

  // Optional debugging hooks
  window.sb.auth.onAuthStateChange((event, session) => {
    console.log("[sb] auth event:", event, session);
  });

  (async () => {
    const { data, error } = await window.sb.auth.getSession();
    if (error) console.error("[sb] getSession error:", error);
    else console.log("[sb] initial session:", data?.session);
  })();
})();
