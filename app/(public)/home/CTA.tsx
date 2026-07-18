"use client";

/**
 * components/home/CTA.tsx
 * ---------------------------------------------------------------
 * The only place on the public site that hits a real mutation
 * (POST /api/contact) — this is why TanStack Query shows up here
 * and nowhere else on these mostly-static pages.
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useToast } from "@/components/toast/ToastProvider";

async function submitContact(data: { name: string; email: string; message: string }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Something went wrong.");
  return json.data;
}

export function CTA() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { showToast } = useToast();
  const { isLimited, trigger } = useRateLimit(5000);

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      showToast("Message sent — I'll reply soon.", "success");
      setForm({ name: "", email: "", message: "" });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger(() => mutation.mutate(form));
  };

  const submitDisabled = isLimited || mutation.isPending;

  return (
    <section className="section-p-x py-20 border-t border-border">
      <div className="max-w-xl">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-text mb-3">
          Start a project
        </h2>
        <p className="font-serif text-base text-muted mb-8">
          Tell me a little about what you're building — I'll get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="cta-name" className="font-mono text-xs text-muted block mb-2">
              Name
            </label>
            <input
              id="cta-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full font-sans text-sm bg-surface border border-border rounded-sm px-4 py-3 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="cta-email" className="font-mono text-xs text-muted block mb-2">
              Email
            </label>
            <input
              id="cta-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full font-sans text-sm bg-surface border border-border rounded-sm px-4 py-3 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="cta-message" className="font-mono text-xs text-muted block mb-2">
              Message
            </label>
            <textarea
              id="cta-message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full font-sans text-sm bg-surface border border-border rounded-sm px-4 py-3 text-text focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitDisabled}
            className="self-start font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-sm transition-colors"
          >
            {mutation.isPending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
