import { useFetchStore } from "../../stores";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Feedback = () => {
  const { errorMsg, successMsg, clearMessages } = useFetchStore();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    clearMessages();
  };

  const open = !!errorMsg || !!successMsg;
  const message = errorMsg || successMsg;
  const severity = errorMsg ? "error" : "success";

  return (
    <>
      {message && (
        <Snackbar
          key={message}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Feedback;
