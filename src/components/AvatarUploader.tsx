import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust if your supabase client path is different

type Props = {
  size?: number;           // avatar size in px
  circle?: boolean;        // round avatar?
  currentUrl?: string|null;// existing avatar URL from DB
};

export default function AvatarUploader({ size = 56, circle = true, currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  // Cloudinary + Edge Function settings from Vercel env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const edgeBase = import.meta.env.VITE_SUPABASE_EDGE_URL as string;

  async function pickFile() {
    inputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErr("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image too large (max 5MB).");
      return;
    }

    // Optimistic preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    setErr(null);

    try {
      // 1) Get user + access token
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      if (sessErr || !sessionData.session) throw new Error("Not signed in");
      const token = sessionData.session.access_token;
      const uid = sessionData.session.user.id;

      // 2) Request signed upload params from Edge Function
      const res = await fetch(`${edgeBase}/cloudinary-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folder: `users/${uid}` }), // folder forced on server too
      });
      if (!res.ok) throw new Error(`Signature request failed: ${res.status}`);
      const signed = await res.json();

      // 3) Upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signed.api_key);
      form.append("timestamp", String(signed.timestamp));
      if (signed.folder) form.append("folder", signed.folder);
      form.append("signature", signed.signature);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloud_name}/image/upload`, {
        method: "POST",
        body: form,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson?.error?.message || "Cloudinary upload failed");

      const newUrl = uploadJson.secure_url as string;

      // 4) Save new URL in Supabase
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: newUrl })
        .eq("id", uid);
      if (updErr) throw updErr;

      setPreview(null); // will show newUrl if parent re-fetches
    } catch (e: any) {
      console.error(e);
      setErr(e.message |
