import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bolt, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/lib/auth";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm transition-colors hover:text-primary ${
        path === to ? "text-primary font-semibold" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bolt className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">SmartLoad DR</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLink("/", "Home")}
            {navLink("/about", "About")}
            {navLink("/features", "Features")}
            {session && navLink("/dashboard", "Dashboard")}
            {session?.role === "admin" && navLink("/admin", "Admin")}
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to={session.role === "admin" ? "/admin" : "/dashboard"}>
                    {session.role === "admin" ? <Shield className="mr-1 h-4 w-4" /> : <LayoutDashboard className="mr-1 h-4 w-4" />}
                    {session.name.split(" ")[0]}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { logout(); navigate({ to: "/" }); }}
                >
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
                <Button asChild size="sm"><Link to="/register">Register</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bolt className="h-4 w-4" />
              </div>
              <span className="font-bold">SmartLoad DR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-based Smart Load Forecasting & Demand Response platform.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Product</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary">Features</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Company</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Account</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary">Register</Link></li>
              <li><Link to="/forgot-password" className="hover:text-primary">Forgot password</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SmartLoad DR — Demo project.
        </div>
      </footer>
    </div>
  );
}
