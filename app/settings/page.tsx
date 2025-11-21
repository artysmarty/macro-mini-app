// app/settings/page.tsx
// This page is now redirected to /profile
// Settings are accessed via gear icon in profile
import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/profile");
}

