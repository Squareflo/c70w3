import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  size?: number;
  circle?: boolean;
  currentUrl?: string | null; // pass the user's current avatar URL (or a fallback)
};

export default function AvatarUploader({ size = 56, circle = true, currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Environment (client-safe) vars
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const edgeBase = import.meta.env.VITE_SUPABASE_EDGE_URL as string;

  function openPicker() {
    inputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setErr("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image is too large (max 5 MB).");
      return;
    }

    // Optimistic preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    setErr(null);

    try {
      // 1) Get current session (access token + user id)
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      if (sessErr || !sessionData.session) throw new Error("Not signed in.");
      const token = sessionData.session.access_token;
      const uid = sessionData.session.user.id;

      // 2) Request signed upload params from Edge Function (requires Bearer token)
      const res = await fetch(`${edgeBase}/cloudinary-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folder: `users/${uid}`, // server also forces users/<uid>, this is just explicit
          // optional: eager: "c_fill,w_320,h_320,q_auto:good"
        }),
      });
      if (!res.ok) throw new Error(`Signature request failed (${res.status})`);
      const signed = await res.json();

      // 3) Upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signed.api_key);
      form.append("timestamp", String(signed.timestamp));
      if (signed.folder) form.append("folder", signed.folder);
      if (signed.public_id) form.append("public_id", signed.public_id);
      if (signed.eager) form.append("eager", signed.eager);
      if (signed.tags) form.append("tags", signed.tags);
      form.append("signature", signed.signature);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloud_name}/image/upload`,
        { method: "POST", body: form }
      );
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson?.error?.message || "Cloudinary upload failed.");
      }

      const newUrl = uploadJson.secure_url as string;

      // 4) Persist to Supabase (profiles.avatar_url), scoped by RLS to this user
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: newUrl })
        .eq("id", uid);
      if (updErr) throw updErr;

      // Clear preview (parent can re-fetch or you can keep optimistic preview)
      setPreview(null);
    } catch (e: any) {
      console.error(e);
      setErr(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
      // Clean up object URL and reset input so same file can be picked again
      if (localUrl) URL.revokeObjectURL(localUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const shown =
    preview ||
    currentUrl ||
    `https://res.cloudinary.com/${cloudName}/image/upload/v1699999999/placeholder_user.png`;

  return (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={openPicker}
        disabled={busy}
        className="relative group"
        aria-label="Change profile picture"
        title="Change profile picture"
        style={{
          width: size,
          height: size,
          borderRadius: circle ? "9999px" : "0.75rem",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={shown}
          alt="Profile"
          className={`object-cover w-full h-full ${busy ? "opacity-70" : "opacity-100"}`}
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/35 flex items-center justify-center text-white text-xs">
          {busy ? "Uploading..." : "Change"}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
    </div>
  );
}
