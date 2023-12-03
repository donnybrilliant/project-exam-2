import { Button, Container } from "@mui/material";

// NotFound is a component that displays a 404 error message
const NotFound = ({ text }) => {
  document.title = "404 - Holidaze";
  return (
    <Container sx={{ textAlign: "center" }}>
      <h1>{text}</h1>
      <Button href="/">Go Back to Home</Button>
    </Container>
  );
};

export default NotFound;
