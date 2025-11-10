
import Navbar from "@/components/navigation/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen">
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main 
        id="main-content"
        className="pt-[8vh] lg:pt-[10vh]"
        tabIndex={-1}
      >
        {children}
      </main>
    </section>
  );
}
