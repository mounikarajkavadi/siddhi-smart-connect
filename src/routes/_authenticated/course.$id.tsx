import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Circle, Download, PlayCircle, Radio } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { supabase } from "@/integrations/supabase/client";
import { WaButton } from "@/components/site/wa";
import { toEmbedUrl } from "@/lib/media";
import { site } from "@/config";

export const Route = createFileRoute("/_authenticated/course/$id")({
  component: CoursePage,
  head: () => ({
    meta: [
      { title: "Course | siddhi-E-learn" },
      { name: "description", content: "Watch your siddhi-E-learn lessons, download notes and join live classes." },
      { property: "og:title", content: "Course | siddhi-E-learn" },
      { property: "og:description", content: "Watch your lessons, download notes and join live classes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function CoursePage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const [{ data: course }, { data: lessons }, { data: enrollment }, { data: progress }] =
        await Promise.all([
          supabase.from("courses").select("*").eq("id", id).maybeSingle(),
          supabase.from("lessons").select("*").eq("course_id", id).order("sort_order"),
          supabase.from("enrollments").select("status").eq("course_id", id).maybeSingle(),
          supabase.from("lesson_progress").select("lesson_id,completed"),
        ]);
      return {
        course,
        lessons: lessons ?? [],
        enrolled: enrollment?.status === "active",
        done: new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 text-sm text-muted-foreground">
          Loading course…
        </main>
      </div>
    );
  }

  const course = data?.course;
  const lessons = data?.lessons ?? [];

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 text-center">
          <h1 className="font-display text-2xl font-extrabold text-primary">Course not found</h1>
          <Link to="/learning" className="mt-4 inline-block text-sm font-semibold text-teal hover:underline">
            Back to My Learning
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data?.enrolled) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-28 text-center">
          <h1 className="font-display text-2xl font-extrabold text-primary">{course.title}</h1>
          <p className="mt-3 text-muted-foreground">
            You don't have access to this course yet. Message us on WhatsApp and we'll unlock it after
            payment.
          </p>
          <WaButton
            message={`Hi ${site.name}! I'd like to enroll in "${course.title}". Please share the payment details.`}
            className="mt-6"
          >
            Enroll — Chat on WhatsApp
          </WaButton>
        </main>
        <Footer />
      </div>
    );
  }

  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];
  const doneCount = lessons.filter((l) => data.done.has(l.id)).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  const openNotes = async (path: string) => {
    const { data: signed, error } = await supabase.storage
      .from("course-notes")
      .createSignedUrl(path, 60 * 10);
    if (error || !signed) {
      toast.error("Couldn't open these notes");
      return;
    }
    window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
  };

  const toggleComplete = async (lessonId: string, completed: boolean) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    if (completed) {
      await supabase
        .from("lesson_progress")
        .delete()
        .eq("lesson_id", lessonId)
        .eq("student_id", auth.user.id);
    } else {
      await supabase
        .from("lesson_progress")
        .insert({ lesson_id: lessonId, student_id: auth.user.id, completed: true });
    }
    qc.invalidateQueries({ queryKey: ["course", id] });
  };

  const embed = toEmbedUrl(active?.video_url);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28">
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="size-4" /> My Learning
        </Link>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-primary">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{course.description}</p>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 w-56 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {doneCount}/{lessons.length} lessons complete
          </span>
        </div>

        {lessons.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Lessons are being added to this course. Check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              {active?.type === "live" ? (
                <div className="rounded-2xl border border-border bg-card p-8">
                  <Radio className="size-7 text-accent" />
                  <h2 className="mt-3 text-xl font-bold text-primary">{active.title}</h2>
                  {active.live_datetime && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(active.live_datetime).toLocaleString()}
                    </p>
                  )}
                  {active.live_url && (
                    <a
                      href={active.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground hover:brightness-110"
                    >
                      Join live class
                    </a>
                  )}
                </div>
              ) : embed ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
                  <iframe
                    src={embed}
                    title={active?.title ?? "Lesson video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8">
                  <h2 className="text-xl font-bold text-primary">{active?.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This lesson has study material only.
                  </p>
                </div>
              )}

              {active && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {active.file_url && (
                    <button
                      type="button"
                      onClick={() => openNotes(active.file_url!)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
                    >
                      <Download className="size-4" /> Download notes
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleComplete(active.id, data.done.has(active.id))}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-105"
                  >
                    {data.done.has(active.id) ? (
                      <>
                        <CheckCircle2 className="size-4" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle className="size-4" /> Mark complete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-border bg-card p-3">
              <ul className="space-y-1">
                {lessons.map((l, i) => {
                  const isActive = l.id === active?.id;
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(l.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                          isActive ? "bg-secondary font-semibold text-primary" : "hover:bg-secondary/60"
                        }`}
                      >
                        {data.done.has(l.id) ? (
                          <CheckCircle2 className="size-4 shrink-0 text-teal" />
                        ) : l.type === "live" ? (
                          <Radio className="size-4 shrink-0 text-accent" />
                        ) : (
                          <PlayCircle className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="flex-1">
                          {i + 1}. {l.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
