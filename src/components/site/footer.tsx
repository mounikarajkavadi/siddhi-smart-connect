import { Instagram } from "lucide-react";
import { courses, genericMessage, site, waLink } from "@/config";
import { WhatsAppIcon } from "./wa";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" width={40} height={40} className="size-10" />
            <span className="font-display text-lg font-extrabold">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Affordable online coaching for UPSC &amp; NEET. {site.tagline}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            {[
              ["#home", "Home"],
              ["#courses", "Courses"],
              ["#plans", "Plans"],
              ["#why-us", "Why Us"],
              ["#about", "About"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-accent">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Courses</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            {courses.map((c) => (
              <li key={c.id}>
                <a href={waLink(c.message)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-primary-foreground/20 p-2.5 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href={waLink(genericMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border border-primary-foreground/20 p-2.5 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/75">{site.email}</p>
          <p className="text-sm text-primary-foreground/75">{site.phoneDisplay}</p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-4 py-5 text-center text-xs text-primary-foreground/60">
        © 2026 {site.name}. Founded by {site.founder}.
      </div>
    </footer>
  );
}
