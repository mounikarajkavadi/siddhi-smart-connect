import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  FileUp,
  GraduationCap,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Radio,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw redirect({ to: "/auth", search: { mode: "login" } });
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: auth.user.id,
      _role: "admin",
    });
    if (!isAdmin) throw redirect({ to: "/learning" });
  },
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin | siddhi-E-learn" },
      { name: "description", content: "Manage courses, lessons, students and course access." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Tab = "overview" | "courses" | "lessons" | "students";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "lessons", label: "Lessons" },
  { id: "students", label: "Students & Access" },
];

const card = "rounded-2xl border border-border bg-card p-6 shadow-soft";
const input =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";
const label = "block text-xs font-bold uppercase tracking-widest text-muted-foreground";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition hover:brightness-110 disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:bg-secondary";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-data"],
    queryFn: async () => {
      const [courses, lessons, profiles, enrollments, roles] = await Promise.all([
        supabase.from("courses").select("*").order("created_at"),
        supabase.from("lessons").select("*").order("sort_order"),
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("enrollments").select("*"),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      const err =
        courses.error || lessons.error || profiles.error || enrollments.error || roles.error;
      if (err) throw err;
      return {
        courses: courses.data ?? [],
        lessons: lessons.data ?? [],
        profiles: profiles.data ?? [],
        enrollments: enrollments.data ?? [],
        roles: roles.data ?? [],
      };
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28">
        <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">Admin</h1>
        <p className="mt-2 text-muted-foreground">
          Add courses and lessons, and control who can access what.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary/70 transition hover:bg-secondary"
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading || !data ? (
          <p className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </p>
        ) : (
          <div className="mt-8">
            {tab === "overview" && <Overview data={data} />}
            {tab === "courses" && <Courses courses={data.courses} />}
            {tab === "lessons" && <Lessons courses={data.courses} lessons={data.lessons} />}
            {tab === "students" && (
              <Students
                profiles={data.profiles}
                courses={data.courses}
                enrollments={data.enrollments}
                roles={data.roles}
              />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Overview ---------------- */

function Overview({ data }: { data: any }) {
  const activeEnrollments = data.enrollments.filter((e: any) => e.status === "active").length;
  const stats = [
    { icon: Users, label: "Students", value: data.profiles.length },
    { icon: BookOpen, label: "Courses", value: data.courses.length },
    { icon: Layers, label: "Lessons", value: data.lessons.length },
    { icon: GraduationCap, label: "Active enrollments", value: activeEnrollments },
  ];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label: l, value }) => (
          <div key={l} className={card}>
            <Icon className="size-6 text-accent" />
            <p className="mt-4 font-display text-3xl font-extrabold text-primary">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-teal">{l}</p>
          </div>
        ))}
      </div>

      <div className={`${card} mt-8`}>
        <h2 className="text-lg font-bold text-primary">Lessons per course</h2>
        {data.courses.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No courses yet — add your first one in the Courses tab.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {data.courses.map((c: any) => {
              const count = data.lessons.filter((l: any) => l.course_id === c.id).length;
              const enrolled = data.enrollments.filter(
                (e: any) => e.course_id === c.id && e.status === "active",
              ).length;
              return (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-semibold text-primary">{c.title}</span>
                  <span className="text-muted-foreground">
                    {count} lesson{count === 1 ? "" : "s"} · {enrolled} enrolled
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

/* ---------------- Courses CRUD ---------------- */

const emptyCourse = { title: "", category: "", description: "", price_text: "" };

function Courses({ courses }: { courses: any[] }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyCourse);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-data"] });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Title is required");
      if (editingId) {
        const { error } = await supabase.from("courses").update(form).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Course updated" : "Course added");
      setForm(emptyCourse);
      setEditingId(null);
      refresh();
    },
    onError: (e: any) => toast.error(e.message ?? "Couldn't save the course"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Course deleted");
      refresh();
    },
    onError: (e: any) => toast.error(e.message ?? "Couldn't delete the course"),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        className={card}
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="text-lg font-bold text-primary">
          {editingId ? "Edit course" : "Add a course"}
        </h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="c-title">
              Title
            </label>
            <input
              id="c-title"
              className={`${input} mt-1.5`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="UPSC Foundation"
              required
            />
          </div>
          <div>
            <label className={label} htmlFor="c-category">
              Category
            </label>
            <input
              id="c-category"
              className={`${input} mt-1.5`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Civil Services"
            />
          </div>
          <div>
            <label className={label} htmlFor="c-price">
              Price text
            </label>
            <input
              id="c-price"
              className={`${input} mt-1.5`}
              value={form.price_text}
              onChange={(e) => setForm({ ...form, price_text: e.target.value })}
              placeholder="₹499 / month"
            />
          </div>
          <div>
            <label className={label} htmlFor="c-desc">
              Description
            </label>
            <textarea
              id="c-desc"
              rows={3}
              className={`${input} mt-1.5 resize-y`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Structured preparation with clear concepts and guidance."
            />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className={btnPrimary} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {editingId ? "Save changes" : "Add course"}
          </button>
          {editingId && (
            <button
              type="button"
              className={btnGhost}
              onClick={() => {
                setEditingId(null);
                setForm(emptyCourse);
              }}
            >
              <X className="size-4" /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className={card}>
        <h2 className="text-lg font-bold text-primary">All courses</h2>
        {courses.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No courses yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {courses.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-teal">
                    {c.category || "Course"}
                  </p>
                  <p className="mt-0.5 font-semibold text-primary">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  {c.price_text && (
                    <p className="mt-1 text-sm font-semibold text-primary">{c.price_text}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${c.title}`}
                    className="rounded-full border border-border p-2 text-primary/70 transition hover:bg-secondary"
                    onClick={() => {
                      setEditingId(c.id);
                      setForm({
                        title: c.title ?? "",
                        category: c.category ?? "",
                        description: c.description ?? "",
                        price_text: c.price_text ?? "",
                      });
                    }}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${c.title}`}
                    className="rounded-full border border-border p-2 text-destructive transition hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm(`Delete "${c.title}" and all its lessons?`)) remove.mutate(c.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------- Lessons ---------------- */

const emptyLesson = {
  title: "",
  type: "video",
  video_url: "",
  live_url: "",
  live_datetime: "",
  sort_order: "",
};

function Lessons({ courses, lessons }: { courses: any[]; lessons: any[] }) {
  const qc = useQueryClient();
  const [courseId, setCourseId] = useState<string>(courses[0]?.id ?? "");
  const [form, setForm] = useState(emptyLesson);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const mine = lessons.filter((l) => l.course_id === courseId);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-data"] });

  const add = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error("Pick a course first");
      if (!form.title.trim()) throw new Error("Lesson title is required");

      let file_url: string | null = null;
      if (file) {
        setUploading(true);
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${courseId}/${Date.now()}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("course-notes")
          .upload(path, file, { upsert: false });
        setUploading(false);
        if (upErr) throw upErr;
        file_url = path;
      }

      const nextOrder =
        form.sort_order !== "" ? Number(form.sort_order) : (mine.at(-1)?.sort_order ?? 0) + 1;

      const { error } = await supabase.from("lessons").insert({
        course_id: courseId,
        title: form.title.trim(),
        type: form.type,
        sort_order: nextOrder,
        video_url: form.type === "video" ? form.video_url.trim() || null : null,
        live_url: form.type === "live" ? form.live_url.trim() || null : null,
        live_datetime:
          form.type === "live" && form.live_datetime
            ? new Date(form.live_datetime).toISOString()
            : null,
        file_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lesson added");
      setForm(emptyLesson);
      setFile(null);
      refresh();
    },
    onError: (e: any) => {
      setUploading(false);
      toast.error(e.message ?? "Couldn't add the lesson");
    },
  });

  const remove = useMutation({
    mutationFn: async (lesson: any) => {
      if (lesson.file_url) {
        await supabase.storage.from("course-notes").remove([lesson.file_url]);
      }
      const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lesson removed");
      refresh();
    },
    onError: (e: any) => toast.error(e.message ?? "Couldn't remove the lesson"),
  });

  if (courses.length === 0) {
    return (
      <p className={`${card} text-sm text-muted-foreground`}>
        Add a course first — lessons live inside a course.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        className={card}
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <h2 className="text-lg font-bold text-primary">Add a lesson</h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="l-course">
              Course
            </label>
            <select
              id="l-course"
              className={`${input} mt-1.5`}
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={label}>Type</span>
            <div className="mt-1.5 flex gap-2">
              {[
                { id: "video", label: "Video", icon: Video },
                { id: "notes", label: "Notes only", icon: FileUp },
                { id: "live", label: "Live class", icon: Radio },
              ].map(({ id, label: l, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm({ ...form, type: id })}
                  className={
                    form.type === id
                      ? "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground"
                      : "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-primary/70 transition hover:bg-secondary"
                  }
                >
                  <Icon className="size-4" /> {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={label} htmlFor="l-title">
              Lesson title
            </label>
            <input
              id="l-title"
              className={`${input} mt-1.5`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Indian Polity — Preamble"
              required
            />
          </div>

          {form.type === "video" && (
            <div>
              <label className={label} htmlFor="l-video">
                YouTube / Vimeo link
              </label>
              <input
                id="l-video"
                className={`${input} mt-1.5`}
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://youtu.be/…"
              />
            </div>
          )}

          {form.type === "live" && (
            <>
              <div>
                <label className={label} htmlFor="l-live-url">
                  Live class link
                </label>
                <input
                  id="l-live-url"
                  className={`${input} mt-1.5`}
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                  placeholder="https://meet.google.com/…"
                />
              </div>
              <div>
                <label className={label} htmlFor="l-live-at">
                  Date &amp; time
                </label>
                <input
                  id="l-live-at"
                  type="datetime-local"
                  className={`${input} mt-1.5`}
                  value={form.live_datetime}
                  onChange={(e) => setForm({ ...form, live_datetime: e.target.value })}
                />
              </div>
            </>
          )}

          <div>
            <label className={label} htmlFor="l-file">
              Notes (PDF) — optional
            </label>
            <input
              id="l-file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
              className={`${input} mt-1.5 file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary`}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Uploaded to the private course-notes bucket — only enrolled students can open it.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="l-order">
              Order — optional
            </label>
            <input
              id="l-order"
              type="number"
              min={0}
              className={`${input} mt-1.5`}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              placeholder="Auto (adds to the end)"
            />
          </div>
        </div>

        <button type="submit" className={`${btnPrimary} mt-6`} disabled={add.isPending || uploading}>
          {add.isPending || uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {uploading ? "Uploading notes…" : "Add lesson"}
        </button>
      </form>

      <div className={card}>
        <h2 className="text-lg font-bold text-primary">
          Lessons in {courses.find((c) => c.id === courseId)?.title ?? "this course"}
        </h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No lessons yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {mine.map((l, i) => (
              <li key={l.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  {l.type === "live" ? (
                    <Radio className="size-4 shrink-0 text-accent" />
                  ) : l.video_url ? (
                    <Video className="size-4 shrink-0 text-teal" />
                  ) : (
                    <FileUp className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-primary">
                      {i + 1}. {l.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {l.type}
                      {l.live_datetime ? ` · ${new Date(l.live_datetime).toLocaleString()}` : ""}
                      {l.file_url ? " · notes attached" : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${l.title}`}
                  className="shrink-0 rounded-full border border-border p-2 text-destructive transition hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm(`Remove "${l.title}"?`)) remove.mutate(l);
                  }}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------- Students & access ---------------- */

function Students({
  profiles,
  courses,
  enrollments,
  roles,
}: {
  profiles: any[];
  courses: any[];
  enrollments: any[];
  roles: any[];
}) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const adminIds = new Set(roles.filter((r) => r.role === "admin").map((r) => r.user_id));
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-data"] });

  const toggle = useMutation({
    mutationFn: async ({
      studentId,
      courseId,
      existing,
    }: {
      studentId: string;
      courseId: string;
      existing: any | undefined;
    }) => {
      if (existing) {
        const { error } = await supabase.from("enrollments").delete().eq("id", existing.id);
        if (error) throw error;
        return "revoked";
      }
      const { error } = await supabase
        .from("enrollments")
        .insert({ student_id: studentId, course_id: courseId, status: "active" });
      if (error) throw error;
      return "granted";
    },
    onSuccess: (result) => {
      toast.success(result === "granted" ? "Access granted" : "Access revoked");
      refresh();
    },
    onError: (e: any) => toast.error(e.message ?? "Couldn't update access"),
  });

  const term = q.trim().toLowerCase();
  const list = term
    ? profiles.filter((p) =>
        [p.first_name, p.last_name, p.email, p.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : profiles;

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">Students &amp; course access</h2>
        <input
          className={`${input} sm:max-w-xs`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or phone"
          aria-label="Search students"
        />
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No students found.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Student
                </th>
                <th className="pb-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Contact
                </th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Course access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((p) => (
                <tr key={p.id} className="align-top">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-primary">
                      {[p.first_name, p.last_name].filter(Boolean).join(" ") || "Unnamed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.gender || "—"}
                      {p.age ? ` · ${p.age}` : ""}
                    </p>
                    {adminIds.has(p.id) && (
                      <span className="mt-1.5 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    <p className="break-all">{p.email}</p>
                    <p>{p.phone}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {courses.length === 0 ? (
                        <span className="text-muted-foreground">No courses yet</span>
                      ) : (
                        courses.map((c) => {
                          const existing = enrollments.find(
                            (e) => e.student_id === p.id && e.course_id === c.id,
                          );
                          const active = existing?.status === "active";
                          return (
                            <button
                              key={c.id}
                              type="button"
                              disabled={toggle.isPending}
                              onClick={() =>
                                toggle.mutate({ studentId: p.id, courseId: c.id, existing })
                              }
                              className={
                                active
                                  ? "rounded-full bg-teal px-3.5 py-1.5 text-xs font-semibold text-teal-foreground transition hover:brightness-110 disabled:opacity-60"
                                  : "rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-primary/60 transition hover:bg-secondary disabled:opacity-60"
                              }
                              title={active ? "Click to revoke" : "Click to grant"}
                            >
                              {c.title}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Green = access granted. Click a course to grant or revoke it.
      </p>
    </div>
  );
}
