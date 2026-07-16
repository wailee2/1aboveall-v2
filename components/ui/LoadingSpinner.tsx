/**
 * components/ui/LoadingSpinner.tsx
 * ---------------------------------------------------------------
 * The one spinner component used everywhere a rotating-circle
 * indicator is needed — first-load splash, route transitions, and
 * any future inline loading state. Consistency rule: if it's a
 * spinner, it's THIS component, never a one-off reimplementation.
 */
export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loading-spinner-ring" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
    </div>
  );
}
