"use client";

export type ToastVariant = "success" | "error" | "info";

const ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

export function Toast({
  message,
  variant,
  exiting,
  onDismiss,
}: {
  message: string;
  variant: ToastVariant;
  exiting?: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`toast-item toast-item-${variant} ${exiting ? "toast-item-exiting" : ""}`}
      role="status"
    >
      <span className="toast-icon" aria-hidden="true">
        {ICONS[variant]}
      </span>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close-button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
