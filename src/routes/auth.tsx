import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { site } from "@/config";

const TITLE = "Sign in or register | siddhi-E-learn";
const DESCRIPTION =
  "Create your siddhi-E-learn student account or sign in to access your courses, video lessons and notes.";

const searchSchema = z.object({
  mode: z.enum(["login", "register"]).default("login").catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[0-9]/, "Password needs a number");

const registerSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(60),
  last_name: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Phone can only contain digits, +, - and spaces"),
  age: z.coerce.number().int().min(8, "Age must be 8 or above").max(100),
  gender: z.enum(["female", "male", "other", "prefer_not_to_say"]),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required"),
});

const inputCls =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-primary/70";

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/learning", replace: true });
  }, [loading, user, navigate]);

  const isRegister = mode === "register";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    try {
      if (isRegister) {
        const parsed = registerSchema.safeParse(fd);
        if (!parsed.success) {
          const map: Record<string, string> = {};
          for (const issue of parsed.error.issues) map[String(issue.path[0])] = issue.message;
          setErrors(map);
          return;
        }
        const v = parsed.data;
        const { data, error } = await supabase.auth.signUp({
          email: v.email,
          password: v.password,
          options: {
            emailRedirectTo: `${window.location.origin}/learning`,
            data: {
              first_name: v.first_name,
              last_name: v.last_name,
              phone: v.phone,
              age: String(v.age),
              gender: v.gender,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Welcome to siddhi-E-learn!");
          navigate({ to: "/learning", replace: true });
        } else {
          setSent(true);
        }
      } else {
        const parsed = loginSchema.safeParse(fd);
        if (!parsed.success) {
          const map: Record<string, string> = {};
          for (const issue of parsed.error.issues) map[String(issue.path[0])] = issue.message;
          setErrors(map);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/learning", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="siddhi-E-learn logo" width={36} height={36} className="size-9" />
          <span className="font-display text-lg font-extrabold text-primary">{site.name}</span>
        </Link>

        {sent ? (
          <div className="mt-8 text-center">
            <h1 className="text-xl font-extrabold text-primary">Check your email</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent you a confirmation link. Click it to activate your account, then sign in.
            </p>
            <Link
              to="/auth"
              search={{ mode: "login" }}
              onClick={() => setSent(false)}
              className="mt-6 inline-block text-sm font-semibold text-teal hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mt-7 font-display text-2xl font-extrabold text-primary">
              {isRegister ? "Create your student account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isRegister
                ? "A few details and you're ready to start learning."
                : "Sign in to continue your course."}
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              {isRegister && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First name" error={errors["first_name"]}>
                      <input name="first_name" className={inputCls} maxLength={60} required />
                    </Field>
                    <Field label="Last name" error={errors["last_name"]}>
                      <input name="last_name" className={inputCls} maxLength={60} required />
                    </Field>
                  </div>
                  <Field label="Phone" error={errors["phone"]}>
                    <input name="phone" type="tel" className={inputCls} maxLength={20} required />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Age" error={errors["age"]}>
                      <input name="age" type="number" min={8} max={100} className={inputCls} required />
                    </Field>
                    <Field label="Gender" error={errors["gender"]}>
                      <select name="gender" className={inputCls} defaultValue="prefer_not_to_say">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}

              <Field label="Email" error={errors["email"]}>
                <input name="email" type="email" className={inputCls} maxLength={255} required />
              </Field>
              <Field label="Password" error={errors["password"]}>
                <input name="password" type="password" className={inputCls} required />
              </Field>
              {isRegister && (
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters with an uppercase letter, a lowercase letter and a number.
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-teal px-6 py-3 text-sm font-semibold text-teal-foreground transition hover:brightness-110 disabled:opacity-60"
              >
                {busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "New to siddhi-E-learn?"}{" "}
              <Link
                to="/auth"
                search={{ mode: isRegister ? "login" : "register" }}
                className="font-semibold text-teal hover:underline"
              >
                {isRegister ? "Sign in" : "Register"}
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelCls}>{label}</span>
      {children}
      {error && <span className="block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}
