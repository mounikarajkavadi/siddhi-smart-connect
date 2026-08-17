import { useEffect, useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { site, genericMessage } from "@/config";
import { WaButton } from "./wa";
import { cn } from "@/lib/utils";
import { useAuth, useIsAdmin, signOutEverywhere } from "@/hooks/use-auth";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#courses", label: "Courses" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOutEverywhere();
    setOpen(false);
    navigate({ to: "/", replace: true });
  };

  const authLinks = (
    <>
      {user ? (
        <>
          <Link
            to="/learning"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary/80 transition-colors hover:text-accent"
          >
            <GraduationCap className="size-4" /> My Learning
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary/80 transition-colors hover:text-accent"
            >
              <LayoutDashboard className="size-4" /> Admin
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary/60 transition-colors hover:text-accent"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </>
      ) : (
        <>
          <Link
            to="/auth"
            search={{ mode: "login" }}
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-primary/80 transition-colors hover:text-accent"
          >
            Login
          </Link>
          <Link
            to="/auth"
            search={{ mode: "register" }}
            onClick={() => setOpen(false)}
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-teal-foreground transition-all hover:brightness-110"
          >
            Register
          </Link>
        </>
      )}
    </>
  );

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
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="siddhi-E-learn logo" width={40} height={40} className="size-10" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight text-primary">
              {site.name}
            </span>
            <span className="block text-[11px] text-muted-foreground">{site.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
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

        <div className="hidden items-center gap-5 lg:flex">{authLinks}</div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-full border border-border bg-card p-2 text-primary lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
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
          <div className="mt-3 flex flex-col items-start gap-3 border-t border-border px-3 pt-4">
            {authLinks}
          </div>
          <WaButton message={genericMessage} className="mt-4 w-full">
            Join on WhatsApp
          </WaButton>
        </div>
      )}
    </header>
  );
}
