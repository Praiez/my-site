import { Link } from "@tanstack/react-router";
import { LayoutGrid, LogOut, QrCode } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { ChurchMark } from "@/components/ChurchMark";

const links = [
  { to: "/", label: "First timers", icon: LayoutGrid },
  { to: "/qr", label: "QR code", icon: QrCode },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const firstName = (user?.full_name || user?.email || "").split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <ChurchMark className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block font-heading text-[15px] font-semibold text-foreground">RCCG DYC</span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">First timers</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-muted/70 p-1 sm:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground md:inline">Hi, {firstName}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 border-t border-border/60 px-4 pb-2 pt-2 sm:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}