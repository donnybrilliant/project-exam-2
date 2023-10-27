// ConfirmationDialog.js
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useDialogStore } from "../../stores"; // Adjust path as necessary

const ConfirmationDialog = () => {
  const { isOpen, title, description, details, onConfirm, closeDialog } =
    useDialogStore();

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
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            closeDialog();
          }}
          color="primary"
          autoFocus
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
