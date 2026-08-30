import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, border: "1px solid #F7EAD8", boxShadow: "0 18px 45px rgba(36,28,21,0.12)", p: 0.5 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <span className="text-xl font-bold text-ink-900">{title}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#7A6C5B" }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
        <Button onClick={onCancel} color="inherit" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            bgcolor: destructive ? "#dc2626" : "#4B5D3A",
            "&:hover": { bgcolor: destructive ? "#b91c1c" : "#3C4A2E" },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
