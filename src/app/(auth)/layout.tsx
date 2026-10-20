import { Logo } from "@/components/marketing/logo";
import { appConfig } from "@/lib/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        aria-hidden
      />
      <div className="relative z-10 mb-8">
        <Logo className="scale-110 dark:[&_span]:text-white" />
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {appConfig.tagline}
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
