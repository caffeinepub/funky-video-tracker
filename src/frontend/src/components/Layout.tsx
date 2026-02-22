import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, Video, LayoutDashboard, Plus } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserRole } from '../hooks/useUserRole';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'learning-videos');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/assets/1771767120748.png" alt="Learning Videos Logo" className="h-10 w-auto" />
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent">
              Learning Videos
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-chart-1 flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Videos
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="text-sm font-medium transition-colors hover:text-chart-4 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Video
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      className="text-sm font-medium transition-colors hover:text-chart-2 flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container flex flex-col gap-4 p-4">
              {isAuthenticated && (
                <>
                  <Link
                    to="/"
                    className="text-sm font-medium transition-colors hover:text-chart-1 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Video className="h-4 w-4" />
                    Videos
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="text-sm font-medium transition-colors hover:text-chart-4 flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Video
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        className="text-sm font-medium transition-colors hover:text-chart-2 flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </>
                  )}
                </>
              )}
              <LoginButton />
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container py-6 px-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>© {currentYear} Learning Videos. All rights reserved.</p>
            <p>
              Built with <span className="text-chart-1">❤</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-chart-1 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
