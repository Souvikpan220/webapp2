export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-24 top-8 h-64 w-64 animate-floaty rounded-full bg-cyan/20 blur-3xl" />
      <div className="absolute -right-20 top-28 h-72 w-72 animate-floaty rounded-full bg-pink/20 blur-3xl [animation-delay:1.2s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-floaty rounded-full bg-violet/20 blur-3xl [animation-delay:2.1s]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />
    </div>
  );
}
