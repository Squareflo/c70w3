// public/js/sb-client.js
(function initSb() {
  const SUPABASE_URL = "https://yihfsdfaobxpoqaghnul.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaGZzZGZhb2J4cG9xYWdobnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTE3NDgsImV4cCI6MjA3MzM2Nzc0OH0.FTyOvpYlb_6EiZnSe3S29vkbmIyw0ayHJHN6Gjt6_zw";

  if (!window.supabase) {
    console.error("[sb-client] Supabase CDN is not loaded. Include it before this file.");
    return;
  }

  if (!window.__sb) {
    window.__sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "sb-chowlocal-auth",
      },
    });
  }
  window.sb = window.__sb;

  window.sb.auth.onAuthStateChange((event, session) => {
    console.log("[sb] auth event:", event, session);
  });

  (async () => {
    const { data, error } = await window.sb.auth.getSession();
    if (error) console.error("[sb] getSession error:", error);
    else console.log("[sb] initial session:", data?.session);
  })();
})();
