import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Imagen",
  description: "Sign in or create your account to start generating amazing images with AI",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen">
      {/* Skip link for keyboard navigation */}
      <a 
        href="#auth-content" 
        className="skip-link"
        aria-label="Skip to authentication form"
      >
        Skip to authentication
      </a>
      
      {/* Main content */}
      <main 
        id="auth-content"
        className="min-h-screen"
        tabIndex={-1}
        role="main"
        aria-label="Authentication page"
      >
        {children}
      </main>
    </section>
  );
}
