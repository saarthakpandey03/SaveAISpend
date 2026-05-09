import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="text-6xl md:text-8xl font-bold text-accent mb-4">404</div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Page not found
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/">Go to homepage</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/audit">Start an audit</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
