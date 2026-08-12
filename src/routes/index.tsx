import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Clock,
  FlaskConical,
  GraduationCap,
  Heart,
  Instagram,
  Lightbulb,
  Mail,
  NotebookPen,
  Phone,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { Reveal } from "@/components/site/reveal";
import { WaButton, WhatsAppIcon } from "@/components/site/wa";
import { courses, genericMessage, plans, site, topics, waLink } from "@/config";
import heroImg from "@/assets/hero-study.jpg";
import notesImg from "@/assets/notes.jpg";
import classImg from "@/assets/class.jpg";
import booksImg from "@/assets/books.jpg";

const TITLE = "siddhi-E-learn | Affordable UPSC & NEET Online Coaching";
const DESCRIPTION =
  "siddhi-E-learn offers affordable online UPSC and NEET coaching with recorded video lessons, study notes and personal WhatsApp doubt support. Every student can learn.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.name,
          slogan: site.tagline,
          email: site.email,
          telephone: "+918125105915",
          description: DESCRIPTION,
          founder: { "@type": "Person", name: site.founder },
        }),
      },
    ],
  }),
});

const courseIcons = [GraduationCap, FlaskConical, RefreshCw, BookOpen];

const chips = [
  "Structured Learning",
  "Expert Guidance",
  "Video Lessons",
  "Study Notes",
  "Doubt Support",
  "Affordable Fees",
];

const whyUs = [
  { icon: Wallet, title: "Affordable Fees", text: "Quality coaching that stays within everyone's reach." },
  { icon: Lightbulb, title: "Concept-First Teaching", text: "We build understanding, not rote memorisation." },
  { icon: Clock, title: "Learn Anytime, Anywhere", text: "Recorded lessons you can revisit at your own pace." },
  { icon: RefreshCw, title: "Regular Updates & Notes", text: "Fresh current affairs and clean downloadable notes." },
  { icon: Heart, title: "Personal WhatsApp Support", text: "Ask a doubt, get a real answer from a real teacher." },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-extrabold uppercase text-primary sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingWhatsApp />

      <main>
        {/* Hero */}
        <section id="home" className="hero-gradient relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
                Online Exam Preparation
              </p>
              <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] text-primary sm:text-6xl">
                We teach.
                <br />
                <span className="text-accent">You achieve.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Structured, affordable coaching for UPSC &amp; NEET — learn anywhere, at your own
                pace.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 text-sm font-semibold text-teal">
                <Sparkles className="size-4" /> {site.tagline}
              </span>

              <ul className="mt-6 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary/80"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <WaButton
                  message="Hi siddhi-E-learn! I want to start learning. Please share the course details."
                  className="px-7 py-4 text-base"
                >
                  Start Learning — Chat on WhatsApp
                </WaButton>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl" aria-hidden="true" />
              <img
                src={heroImg}
                alt="Student preparing for competitive exams online with a laptop and notes"
                width={1280}
                height={1024}
                className="relative rounded-3xl shadow-soft"
              />
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <SectionHeading
                eyebrow="What we teach"
                title="Our Courses"
                subtitle="Focused programmes built around clear concepts, revision-ready notes and honest pricing."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course, i) => {
                const Icon = courseIcons[i % courseIcons.length];
                return (
                  <Reveal key={course.id} delay={i * 80}>
                    <article className="lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <Icon className="size-6" />
                      </span>
                      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-teal">
                        {course.kicker}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-primary">{course.title}</h3>
                      <p className="mt-3 flex-1 text-sm text-muted-foreground">{course.description}</p>
                      <p className="mt-5 font-display text-2xl font-extrabold text-primary">
                        {course.price}
                        <span className="text-sm font-semibold text-muted-foreground"> {course.period}</span>
                      </p>
                      <WaButton message={course.message} className="mt-5 w-full">
                        Enquire on WhatsApp
                      </WaButton>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Spotlight band */}
        <section className="band-gradient py-20 text-primary-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-extrabold uppercase sm:text-4xl">Learn With Confidence</h2>
              <p className="mt-4 max-w-lg text-primary-foreground/80">
                Watch recorded video lessons whenever it suits you, revise from clear downloadable
                notes, stay current with regular current-affairs updates, and get personal
                doubt-support straight over WhatsApp.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  { icon: PlayCircle, text: "Video Lessons Anytime" },
                  { icon: NotebookPen, text: "Clear Study Notes" },
                  { icon: WhatsAppIcon, text: "Personal Doubt Support" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 font-semibold">
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Icon className="size-5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <WaButton message={genericMessage} className="mt-8">
                Talk to Us on WhatsApp
              </WaButton>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={notesImg}
                  alt="Handwritten study notes beside a tablet playing a video lesson"
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="col-span-2 h-52 w-full rounded-2xl object-cover shadow-soft"
                />
                <img
                  src={classImg}
                  alt="Students attending an online class"
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-40 w-full rounded-2xl object-cover shadow-soft"
                />
                <img
                  src={booksImg}
                  alt="Stack of study books beside a globe"
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-40 w-full rounded-2xl object-cover shadow-soft"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* What we cover */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <Reveal>
              <SectionHeading eyebrow="Syllabus" title="What We Cover" />
              <ul className="mt-10 flex flex-wrap justify-center gap-3">
                {topics.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-teal/25 bg-teal/5 px-5 py-2.5 text-sm font-semibold text-teal transition-colors hover:bg-teal hover:text-teal-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <SectionHeading
                eyebrow="Pricing"
                title="Plans"
                subtitle="Simple monthly pricing. No hidden fees — just message us on WhatsApp to enroll."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 90}>
                  <article
                    className={
                      plan.popular
                        ? "lift relative flex h-full flex-col rounded-2xl bg-primary p-8 text-primary-foreground shadow-soft"
                        : "lift flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-soft"
                    }
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                        Popular
                      </span>
                    )}
                    <h3
                      className={
                        plan.popular
                          ? "text-lg font-bold uppercase tracking-wide"
                          : "text-lg font-bold uppercase tracking-wide text-primary"
                      }
                    >
                      {plan.name}
                    </h3>
                    <p className="mt-4 font-display text-4xl font-extrabold">
                      {plan.price}
                      <span
                        className={
                          plan.popular
                            ? "text-sm font-semibold text-primary-foreground/70"
                            : "text-sm font-semibold text-muted-foreground"
                        }
                      >
                        {" "}
                        {plan.period}
                      </span>
                    </p>
                    <ul className="mt-6 flex-1 space-y-3 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                          <span className={plan.popular ? "text-primary-foreground/85" : "text-muted-foreground"}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <WaButton
                      message={plan.message}
                      variant={plan.popular ? "accent" : "outline"}
                      className="mt-8 w-full"
                    >
                      Enroll via WhatsApp
                    </WaButton>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section id="why-us" className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <SectionHeading eyebrow="Our promise" title="Why Choose Us" />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {whyUs.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <div className="lift h-full rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                    <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-teal/12 text-teal">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-primary">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <Reveal>
              <img
                src={classImg}
                alt="Students learning together in an online session"
                width={1024}
                height={768}
                loading="lazy"
                className="rounded-3xl shadow-soft"
              />
            </Reveal>
            <Reveal delay={100}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Our story</p>
              <h2 className="mt-3 text-3xl font-extrabold uppercase text-primary sm:text-4xl">About Us</h2>
              <p className="mt-5 text-muted-foreground">
                siddhi-E-learn was founded on a simple belief: every student deserves quality
                education, taught in a way that is clear and easy to understand. Our mission is to
                help learners build strong concepts, grow in confidence, and reach their goals — all
                at a price that keeps learning within everyone's reach.
              </p>
              <figure className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <blockquote className="text-primary">
                  “I believe every student deserves quality education in a simple, understandable
                  way.”
                </blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-teal">
                  {site.founder}, Founder
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[heroImg, notesImg, classImg, booksImg].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Students, notes and study materials at siddhi-E-learn"
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="lift h-40 w-full rounded-2xl object-cover shadow-soft sm:h-52"
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12">
                <SectionHeading
                  eyebrow="Contact"
                  title="Get In Touch"
                  subtitle="Have a question about a course or fees? Message us on WhatsApp — we usually reply within a few hours."
                />
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <a
                    href={waLink(genericMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lift flex items-center gap-3 rounded-2xl border border-border p-4 text-left"
                  >
                    <WhatsAppIcon className="size-5 shrink-0 text-whatsapp" />
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        WhatsApp
                      </span>
                      <span className="font-semibold text-primary">{site.phoneDisplay}</span>
                    </span>
                  </a>
                  <a
                    href={`tel:+${site.whatsappNumber}`}
                    className="lift flex items-center gap-3 rounded-2xl border border-border p-4 text-left"
                  >
                    <Phone className="size-5 shrink-0 text-teal" />
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Call
                      </span>
                      <span className="font-semibold text-primary">{site.phoneDisplay}</span>
                    </span>
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="lift flex items-center gap-3 rounded-2xl border border-border p-4 text-left"
                  >
                    <Mail className="size-5 shrink-0 text-teal" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Email
                      </span>
                      <span className="block truncate font-semibold text-primary">{site.email}</span>
                    </span>
                  </a>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lift flex items-center gap-3 rounded-2xl border border-border p-4 text-left"
                  >
                    <Instagram className="size-5 shrink-0 text-accent" />
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Instagram
                      </span>
                      <span className="font-semibold text-primary">@siddhi-E-learn</span>
                    </span>
                  </a>
                </div>
                <WaButton message={genericMessage} className="mt-8 px-8 py-4 text-base">
                  Enquire Now on WhatsApp
                </WaButton>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
