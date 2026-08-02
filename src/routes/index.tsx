import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChefHat, QrCode, Bell, BarChart3, Users, Ticket, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexavo POS — Smart Billing + Live Customer Order Tracking" },
      { name: "description", content: "Modern POS for restaurants and food courts with billing, product management, kitchen workflow, QR tracking and real-time customer updates." },
      { property: "og:title", content: "Nexavo POS" },
      { property: "og:description", content: "Smart billing and live order tracking for modern food businesses." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(182,124,47,0.18),_transparent_30%),_linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(248,239,228,0.96))]">
      <header className="border-b border-[#d8b46b]/40 bg-[rgba(255,250,243,0.82)] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(74,15,15,0.45)]">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Nexavo POS</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth" search={{ mode: "signup" }}><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe0c6] text-[#6b1d1d] text-xs font-medium mb-6 border border-[#d8b46b]/50">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Smart Billing + Live Customer Order Tracking
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            The complete POS platform for modern food businesses.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Run billing, manage products, coordinate kitchen orders, send live customer updates and keep every transaction in Firebase. Set up in 60 seconds.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/auth" search={{ mode: "signup" }} className="w-full sm:w-auto">
              <Button size="lg" className="shadow-elev w-full sm:w-auto">Launch Nexavo POS</Button>
            </Link>
            <a
              href="/downloads/nexavo-pos.apk"
              download
              type="application/vnd.android.package-archive"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-10 rounded-md px-8 text-sm font-semibold bg-primary text-primary-foreground shadow-elev transition-colors duration-75 hover:bg-primary/90 active:scale-95 active:opacity-90 will-change-transform"
              aria-label="Download Nexavo POS APK"
            >
              Download Now
            </a>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Sign in</Button>
            </Link>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">All your POS workflows stay connected in one Firebase-powered workspace.</div>
        </div>
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none gradient-hero blur-3xl rounded-full top-40 mx-auto max-w-2xl h-64" />
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
        {[
          { i: QrCode, t: "QR loyalty & tracking", d: "Generate shop and table QR codes for instant customer tracking." },
          { i: Bell, t: "Live kitchen updates", d: "Customers receive real-time status changes the moment orders move through the kitchen." },
          { i: BarChart3, t: "Sales insights", d: "Watch daily, weekly and monthly revenue from the built-in reports view." },
          { i: Users, t: "Customer CRM", d: "Capture orders, spending and loyalty data for returning diners." },
          { i: Ticket, t: "Flexible billing", d: "Support cash, UPI, card and split payments from one POS screen." },
          { i: CheckCircle2, t: "Firebase-backed", d: "Products, orders and payments stay synchronized in Firestore." },
        ].map((f) => (
          <div key={f.t} className="gradient-card border border-border rounded-2xl p-6 shadow-soft">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <f.i className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-lg">{f.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 text-sm text-muted-foreground flex justify-between">
          <div>© Nexavo POS</div>
          <div>Built with Firebase + React</div>
        </div>
      </footer>
    </div>
  );
}
