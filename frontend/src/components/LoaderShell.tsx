import { Background } from "./Background";

export function LoaderShell() {
  return (
    <main className="app-shell relative">
      <Background />
      <div className="mobile-frame relative pt-16">
        <div className="glass rounded-[32px] p-5">
          <div className="mb-6 h-20 rounded-3xl shimmer animate-shimmer" />
          <div className="space-y-3">
            <div className="h-14 rounded-2xl shimmer animate-shimmer" />
            <div className="h-14 rounded-2xl shimmer animate-shimmer" />
            <div className="h-28 rounded-3xl shimmer animate-shimmer" />
          </div>
        </div>
      </div>
    </main>
  );
}
