/**
 * 404 page — deliberately simple and static (no client interactivity
 * needed), consistent visually with ErrorFallback but its own
 * component since a missing page isn't an "error" in the same sense.
 */

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">
        404
      </div>
      <h1 className="font-sans text-2xl font-semibold text-text mb-3">
        Page not found
      </h1>
      <p className="font-serif text-base text-muted mb-8 max-w-md">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <a
        href="/"
        className="font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover px-5 py-2.5 rounded-sm transition-colors"
      >
        Back home
      </a>
    </div>
  );
}
