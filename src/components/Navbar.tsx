import { Link } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import auth from "@/lib/auth";

const Navbar = () => {
  const { session } = useSession();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(session?.user?.email ?? null);
  }, [session]);

  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">LiquidMktplace</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Browse
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            My Library
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border p-1"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:block">{email}</span>
              <button
                onClick={async () => await auth.signOut()}
                className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          <div className="w-72 max-w-full bg-background p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Code2 className="h-6 w-6" />
                <span className="text-lg font-semibold tracking-tight">LiquidMktplace</span>
              </Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>
                Browse
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>
                My Library
              </Link>

              <div className="mt-4 border-t pt-4">
                {session ? (
                  <>
                    <div className="mb-3 text-sm text-muted-foreground">{session?.user?.email}</div>
                    <button
                      onClick={async () => {
                        await auth.signOut();
                        setOpen(false)
                      }}
                      className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/signup" className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => setOpen(false)}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
