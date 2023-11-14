import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useDialogStore, useFetchStore } from "../../stores"; // Adjust path as necessary
import LoadingButton from "@mui/lab/LoadingButton";

const ConfirmationDialog = () => {
  const { isOpen, title, description, details, onConfirm, closeDialog } =
    useDialogStore();
  const isLoading = useFetchStore((state) => state.isLoading);

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          textTransform: "capitalize",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        <DialogContentText
          id="alert-dialog-details"
          sx={{ fontWeight: "bold" }}
        >
          {details}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton onClick={onConfirm} loading={isLoading}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
