import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, BookOpen } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { supabase } from "@/integrations/supabase/client";
import { WaButton } from "@/components/site/wa";
import { site } from "@/config";

const TITLE = "My Learning | siddhi-E-learn";
const DESCRIPTION = "Your enrolled siddhi-E-learn courses, video lessons, notes and live classes.";

export const Route = createFileRoute("/_authenticated/learning")({
  component: LearningPage,
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

function LearningPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-learning"],
    queryFn: async () => {
      const [{ data: courses, error: cErr }, { data: enrollments, error: eErr }] = await Promise.all([
        supabase.from("courses").select("*").order("created_at"),
        supabase.from("enrollments").select("course_id,status"),
      ]);
      if (cErr) throw cErr;
      if (eErr) throw eErr;
      const enrolled = new Set(
        (enrollments ?? []).filter((e) => e.status === "active").map((e) => e.course_id),
      );
      return { courses: courses ?? [], enrolled };
    },
  });

  const mine = (data?.courses ?? []).filter((c) => data?.enrolled.has(c.id));
  const others = (data?.courses ?? []).filter((c) => !data?.enrolled.has(c.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28">
        <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">My Learning</h1>
        <p className="mt-2 text-muted-foreground">
          Continue where you left off, or ask us on WhatsApp to unlock a new course.
        </p>

        {isLoading ? (
          <p className="mt-12 text-sm text-muted-foreground">Loading your courses…</p>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal">Enrolled</h2>
              {mine.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                  <GraduationCap className="mx-auto size-8 text-accent" />
                  <p className="mt-3 font-semibold text-primary">You're not enrolled yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Message us on WhatsApp to join a course — we'll unlock it for you right after payment.
                  </p>
                  <WaButton
                    message={`Hi ${site.name}! I'd like to enroll in a course.`}
                    className="mt-5"
                  >
                    Enroll — Chat on WhatsApp
                  </WaButton>
                </div>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {mine.map((c) => (
                    <article
                      key={c.id}
                      className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
                    >
                      <BookOpen className="size-6 text-accent" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-teal">
                        {c.category || "Course"}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-primary">{c.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                      <Link
                        to="/course/$id"
                        params={{ id: c.id }}
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition hover:brightness-110"
                      >
                        Go to Course
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {others.length > 0 && (
              <section className="mt-14">
                <h2 className="text-xs font-bold uppercase tracking-widest text-teal">
                  More courses
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {others.map((c) => (
                    <article
                      key={c.id}
                      className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-teal">
                        {c.category || "Course"}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-primary">{c.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                      {c.price_text && (
                        <p className="mt-4 font-display text-xl font-extrabold text-primary">
                          {c.price_text}
                        </p>
                      )}
                      <WaButton
                        message={`Hi ${site.name}! I'd like to enroll in "${c.title}". Please share the payment details.`}
                        className="mt-4 w-full"
                      >
                        Enroll — Chat on WhatsApp
                      </WaButton>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
