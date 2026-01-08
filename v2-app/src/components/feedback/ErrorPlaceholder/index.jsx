import styles from "./ErrorPlaceholder.module.css";
import {
  WifiOff,
  SearchX,
  Ghost,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

const PRESETS = {
  network: {
    Icon: WifiOff,
    title: "Connection problem",
    message: "Check your internet connection and try again.",
  },
  "not-found": {
    Icon: SearchX,
    title: "Not found",
    message: "We couldn’t find what you’re looking for.",
  },
  empty: {
    Icon: Ghost,
    title: "Nothing here yet",
    message: "Try changing filters or searching for something else.",
  },
  unknown: {
    Icon: AlertTriangle,
    title: "Something went wrong",
    message: "Please try again in a moment.",
  },
};

export default function ErrorPlaceholder({
  type = "unknown",
  title,
  message,
  actionLabel = "Retry",
  onAction,
  secondaryLabel,
  onSecondaryAction,
  compact = false,
}) {
  const preset = PRESETS[type] ?? PRESETS.unknown;
  const Icon = preset.Icon;

  return (
    <section
      className={`${styles.wrapper} ${compact ? styles.compact : ""}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Icon size={28} />
        </div>

        <h4 className={styles.title}>{title ?? preset.title}</h4>

        {(message ?? preset.message) && (
          <p className={styles.message}>{message ?? preset.message}</p>
        )}

        {(onAction || onSecondaryAction) && (
          <div className={styles.actions}>
            {onAction && (
              <button
                type="button"
                className="btnPrimary"
                onClick={onAction}
              >
                <RefreshCcw size={18} />
                {actionLabel}
              </button>
            )}

            {onSecondaryAction && secondaryLabel && (
              <button
                type="button"
                className="btnSecondary"
                onClick={onSecondaryAction}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
