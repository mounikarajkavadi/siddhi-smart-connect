import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FlaskConical, GraduationCap, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Reveal } from "./reveal";
import { WaButton } from "./wa";
import { courses as fallbackCourses, site } from "@/config";

const courseIcons = [GraduationCap, FlaskConical, RefreshCw, BookOpen];

type Card = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  price: string;
  period: string;
  fromDb: boolean;
};

/**
 * Landing-page course grid. Pulls courses from the database when they exist and
 * shows "Go to Course" for anything the signed-in student already has access to;
 * everyone else gets "Enroll — Chat on WhatsApp". Falls back to the static
 * config list while the DB catalogue is still empty.
 */
export function CourseCatalogue() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["catalogue", user?.id ?? "anon"],
    queryFn: async () => {
      const { data: courses } = await supabase.from("courses").select("*").order("created_at");
      let enrolled = new Set<string>();
      if (user) {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("course_id,status");
        enrolled = new Set(
          (enrollments ?? []).filter((e) => e.status === "active").map((e) => e.course_id),
        );
      }
      return { courses: courses ?? [], enrolled };
    },
  });

  const dbCourses = data?.courses ?? [];
  const enrolled = data?.enrolled ?? new Set<string>();

  const cards: Card[] = dbCourses.length
    ? dbCourses.map((c) => ({
        id: c.id,
        title: c.title,
        kicker: c.category || "Course",
        description: c.description ?? "",
        price: c.price_text ?? "",
        period: "",
        fromDb: true,
      }))
    : fallbackCourses.map((c) => ({
        id: c.id,
        title: c.title,
        kicker: c.kicker,
        description: c.description,
        price: c.price,
        period: c.period,
        fromDb: false,
      }));

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = courseIcons[i % courseIcons.length] ?? GraduationCap;
        const hasAccess = c.fromDb && enrolled.has(c.id);
        return (
          <Reveal key={c.id} delay={i * 80}>
            <article className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="size-6" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-teal">{c.kicker}</p>
              <h3 className="mt-1 text-xl font-bold text-primary">{c.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.description}</p>
              {c.price && (
                <p className="mt-5 font-display text-2xl font-extrabold text-primary">
                  {c.price}
                  {c.period && (
                    <span className="text-sm font-semibold text-muted-foreground"> {c.period}</span>
                  )}
                </p>
              )}
              {hasAccess ? (
                <Link
                  to="/course/$id"
                  params={{ id: c.id }}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-3 text-sm font-semibold text-teal-foreground transition hover:brightness-110"
                >
                  Go to Course
                </Link>
              ) : (
                <WaButton
                  message={`Hi ${site.name}! I'd like to enroll in "${c.title}". Please share the payment details.`}
                  className="mt-5 w-full"
                >
                  Enroll — Chat on WhatsApp
                </WaButton>
              )}
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
