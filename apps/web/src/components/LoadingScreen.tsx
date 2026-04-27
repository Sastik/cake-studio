export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="glass rounded-2xl px-5 py-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blush-200 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-blush-100 animate-pulse [animation-delay:120ms]" />
          <span className="h-2 w-2 rounded-full bg-blush-50 animate-pulse [animation-delay:240ms]" />
          <span className="text-sm text-slate-700">Loading…</span>
        </div>
      </div>
    </div>
  );
}

