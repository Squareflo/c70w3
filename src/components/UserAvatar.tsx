import AvatarUploader from "@/components/AvatarUploader";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function UserAvatar({ size = 56, circle = true }: { size?: number; circle?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      setUrl(data?.avatar_url ?? null);
    })();
  }, []);

  return <AvatarUploader currentUrl={url} size={size} circle={circle} />;
}
