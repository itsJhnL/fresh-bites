import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";

const SEVERITY_STYLES = {
  success: "border-sage-200 bg-sage-50 text-sage-700",
  error: "border-red-200 bg-red-50 text-red-700",
  warning: "border-terracotta-200 bg-terracotta-50 text-terracotta-700",
};

const SEVERITY_ICONS = {
  success: CheckCircleOutlineIcon,
  error: ErrorOutlineIcon,
  warning: WarningAmberIcon,
};

// One shared toast for the whole app (see agents.md's reusable-component
// list) — replaces six near-identical MUI Snackbar+Alert blocks that only
// ever used MUI's default success/error/warning palette, which never
// matched FreshBite's own cream/sage/terracotta tokens. Same contract MUI's
// Snackbar had (open/message/severity/onClose/autoHideDuration), so call
// sites needed no logic changes — the timer lives here, not per call site.
export default function Toast({ open, message, severity = "success", onClose, autoHideDuration = 2200 }) {
  const Icon = SEVERITY_ICONS[severity] || SEVERITY_ICONS.success;

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(onClose, autoHideDuration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoHideDuration]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-start gap-2.5 rounded-lg border px-4 py-3 text-sm font-semibold shadow-card ${
            SEVERITY_STYLES[severity] || SEVERITY_STYLES.success
          }`}
        >
          <Icon fontSize="small" className="mt-0.5 shrink-0" />
          <span className="flex-1">{message}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="shrink-0 opacity-70 transition hover:opacity-100"
          >
            <CloseIcon fontSize="small" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
