"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-7"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fire font-display text-base font-extrabold text-white">
            iG
          </span>
          <div className="font-display text-lg font-extrabold text-ink">
            房源后台 Admin
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">登录管理项目内容</p>

        <label className="mt-6 block text-sm text-muted">邮箱 Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-fire"
        />

        <label className="mt-4 block text-sm text-muted">密码 Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-fire"
        />

        {err && (
          <p className="mt-4 rounded-lg bg-fire/12 px-3 py-2 text-sm text-fire">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-fire px-6 py-3 font-semibold text-white transition hover:bg-fire-2 disabled:opacity-60"
        >
          {loading ? "登录中…" : "登录 Login"}
        </button>
      </form>
    </main>
  );
}
