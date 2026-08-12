import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site, genericMessage } from "@/config";
import { WaButton } from "./wa";
import { cn } from "@/lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#why-us", label: "Why Us" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#home" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="siddhi-E-learn logo" width={40} height={40} className="size-10" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight text-primary">
              {site.name}
            </span>
            <span className="block text-[11px] text-muted-foreground">{site.tagline}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-primary/80 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WaButton message={genericMessage} className="px-5 py-2.5">
            Join on WhatsApp
          </WaButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-full border border-border bg-card p-2 text-primary md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-semibold text-primary hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <WaButton message={genericMessage} className="mt-3 w-full">
            Join on WhatsApp
          </WaButton>
        </div>
      )}
    </header>
  );
}
