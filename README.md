# siddhi-E-learn Launchpad

# Lovable Build Prompt — "siddhi-E-learn" Course Website (WhatsApp enquiry model)

> Paste this whole thing into Lovable as your first message. It builds the entire website in one go. There is **no login and no payment gateway** — every call-to-action opens WhatsApp. Keep it simple, polished, and mobile-first.

---

Build a modern, elegant, mobile-first **marketing website for an online education brand called "siddhi-E-learn"**. It is a single-page scrolling site (with smooth-scroll nav) plus a sticky header and a floating WhatsApp button. There is **NO user login, NO account system, NO payment gateway, and NO backend/database** — it is a front-end-only showcase site where **every button and enquiry opens WhatsApp** with a pre-filled message. Think of it like a beautiful brochure that funnels every visitor into a WhatsApp chat.

## The brand
- **Name:** siddhi-E-learn
- **Tagline:** "every student can learn"
- **What it offers:** affordable online exam-preparation courses (recorded video lessons + study notes) for Indian students.
- **Founder:** Keerthana Raj Kavadi.
- **Primary WhatsApp number:** +91 8125105915 (all CTAs link here).
- **Email:** mkavadi@crimson.ua.edu
- **Instagram:** <<ADD_INSTAGRAM_LINK>>
- **Logo concept:** an open book with a rising human figure reaching toward a target/arrow — symbolizing growth and goals. Palette is **navy blue, saffron/orange, and teal**. Create a clean SVG logo lockup in this spirit (book + rising figure + small target), with the wordmark "siddhi-E-learn" and the small tagline "every student can learn". Put a `logo.svg` placeholder I can replace.

## Design direction
- Clean, trustworthy, education-focused, premium but friendly. Take structural inspiration from a modern event/agency landing page: bold hero, service cards, a spotlight feature band, a "what we cover" chip list, pricing tiers, why-choose-us, about, gallery, and a strong contact section — but themed for online coaching.
- **Colors:** deep navy/ink `#12224A` as primary dark, **saffron `#E8973A`** as the accent/CTA color, **teal `#1F7A6E`** as secondary accent, warm off-white `#FBF7EF` background, clean whites for cards. Use tasteful gradients on the hero.
- **Typography:** a strong modern display font for headings (bold, slightly condensed, some uppercase headlines like the reference) paired with a clean, readable sans for body (e.g., Plus Jakarta Sans / Inter). Big confident headings, generous spacing.
- Rounded cards, soft shadows, subtle hover lifts, smooth scroll, gentle fade-in-on-scroll animations. Fully responsive; looks great on a phone first (most visitors come from an Instagram bio link).

## Global elements
- **Sticky top navbar:** logo on the left; links Home, Courses, Why Us, About, Contact that smooth-scroll to sections; and a prominent saffron **"Join on WhatsApp"** button on the right. Collapses to a clean mobile menu.
- **Floating WhatsApp button** fixed at bottom-right on all screens (WhatsApp-green, with icon), opens the chat.
- **WhatsApp behavior:** every CTA opens `https://wa.me/918125105915` with a **pre-filled message** relevant to what was clicked (examples given below). Open in a new tab.
- Store the WhatsApp number, email, and the course list in a single easy-to-edit constants file (e.g., `src/config.ts`) so I can update them without hunting through code.

## Sections (in order) with content

### 1. Hero
- Small eyebrow: "ONLINE EXAM PREPARATION".
- Big headline, confident and two-line, e.g. **"WE TEACH. YOU ACHIEVE."**
- Sub-line: "Structured, affordable coaching for UPSC & NEET — learn anywhere, at your own pace."
- Tagline pill: "every student can learn".
- A row of small feature chips: **Structured Learning • Expert Guidance • Video Lessons • Study Notes • Doubt Support • Affordable Fees**.
- Primary CTA button (saffron): **"Start Learning — Chat on WhatsApp"** → WhatsApp with message: "Hi siddhi-E-learn! I want to start learning. Please share the course details."
- A supporting hero image/illustration (use a tasteful education-themed placeholder).

### 2. Courses (like a "Our Services" grid)
A heading "OUR COURSES" and a grid of course cards. Each card: an icon, course title, a 1–2 line description, the price, and an **"Enquire on WhatsApp"** button with a course-specific pre-filled message.
- **UPSC Foundation** — Civil Services. "Structured preparation for UPSC aspirants — clear concepts, current affairs and guidance." **₹499 / month.** WhatsApp msg: "Hi siddhi-E-learn! I'm interested in the UPSC Foundation course (₹499/month). Please share the details."
- **NEET Preparation** — Medical Entrance. "Concept-first NEET coaching covering Physics, Chemistry and Biology fundamentals." **₹499 / month.** WhatsApp msg: "Hi siddhi-E-learn! I'm interested in the NEET Preparation course (₹499/month). Please share the details."
- Add two more attractive placeholder cards I can edit later: **Current Affairs & Test Series** and **Foundation Basics (Class 11–12)** — each "Coming soon / Enquire on WhatsApp".

### 3. Spotlight band (feature highlight, like the reference "concerts" band)
A darker navy full-width band titled e.g. **"Learn With Confidence"** describing the experience: recorded video lessons you can watch anytime, downloadable notes, regular current-affairs updates, and personal doubt-support over WhatsApp. Include 3 bullet highlights (Video Lessons Anytime • Clear Study Notes • Personal Doubt Support) and a CTA **"Talk to Us on WhatsApp"**. Use 2–3 education/study placeholder images.

### 4. What We Cover (chip/tag list, like "we manage all events")
A heading and a wrap of pill tags of subjects/exams: UPSC Prelims, UPSC Mains, Polity, History, Geography, Economy, Current Affairs, NEET Physics, NEET Chemistry, NEET Biology, NCERT Foundation, Mock Tests, Doubt Sessions.

### 5. Packages / Pricing (tiered cards, like the reference packages)
A "PLANS" heading with 3 clean pricing cards, each with an "Enroll via WhatsApp" button (pre-filled message naming the plan):
- **Single Course — ₹499 / month:** access to one course (UPSC or NEET), all video lessons + notes, WhatsApp doubt support.
- **Both Courses — ₹899 / month** (highlight as "Popular"): access to both UPSC & NEET, all lessons + notes, priority doubt support.
- **3-Month Saver — ₹1299:** one course for 3 months at a discount, all lessons + notes.
(These are editable placeholders; mark the middle one as the highlighted/"Popular" plan.)

### 6. Why Choose Us
A row/grid of 5 value props with icons: Affordable Fees • Concept-First Teaching • Learn Anytime, Anywhere • Regular Updates & Notes • Personal WhatsApp Support.

### 7. About
"ABOUT US" heading with the mission copy: "siddhi-E-learn was founded on a simple belief: every student deserves quality education, taught in a way that is clear and easy to understand. Our mission is to help learners build strong concepts, grow in confidence, and reach their goals — all at a price that keeps learning within everyone's reach." Include a small founder note: **Keerthana Raj Kavadi, Founder**, with a short quote: "I believe every student deserves quality education in a simple, understandable way."

### 8. Gallery (optional, tasteful)
A small grid of study/education placeholder images (students learning, notes, online class vibe) to add warmth. Use royalty-free placeholder images.

### 9. Contact (strong, like the reference)
"GET IN TOUCH" with:
- **WhatsApp:** +91 8125105915 (button → chat).
- **Call:** +91 8125105915.
- **Email:** mkavadi@crimson.ua.edu.
- **Instagram:** link (placeholder).
- A big **"Enquire Now on WhatsApp"** button.
- Friendly line: "Have a question about a course or fees? Message us on WhatsApp — we usually reply within a few hours."

### 10. Footer
Dark navy footer with: logo + one-line description ("Affordable online coaching for UPSC & NEET. every student can learn."), Quick Links (smooth-scroll), a Courses list, Follow Us (Instagram + WhatsApp), and copyright "© 2026 siddhi-E-learn. Founded by Keerthana Raj Kavadi."

## Pre-filled WhatsApp messages
For each CTA, open `https://wa.me/918125105915?text=<url-encoded message>` in a new tab, using the specific messages above (generic hero/contact CTAs can use: "Hi siddhi-E-learn! I'd like to know more about your courses.").

## Technical & quality requirements
- React + Tailwind (Lovable default) + shadcn/ui components; TypeScript.
- **No backend, no auth, no database, no payment SDK.** Purely static front-end. Do not add Supabase, Razorpay, Stripe, or any login.
- Fully responsive and fast; semantic, accessible HTML; good color contrast; keyboard-focusable buttons.
- Smooth scrolling for nav links; subtle scroll-reveal animations; sticky header; floating WhatsApp button.
- Basic SEO: page title "siddhi-E-learn | Affordable UPSC & NEET Online Coaching", meta description, Open Graph tags, and a favicon from the logo.
- Put all editable content (WhatsApp number, email, Instagram, course names/prices/descriptions, plan prices) in one `src/config.ts` so it's easy to change.
- Use clean placeholder images (royalty-free) that I can swap later, and a placeholder `logo.svg` I can replace with my real logo.

**Build the complete website now, all sections, in one go.** Make it polished and launch-ready so I can publish it and put the link in my Instagram bio.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://siddhi-smart-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b7f19ca-74cc-4741-9ea3-c449e31b45af).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
