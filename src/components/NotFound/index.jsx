import { Button, Container } from "@mui/material";
import React from "react";

const NotFound = ({ text }) => {
  return (
    <Container sx={{ textAlign: "center" }}>
      <h1>{text}</h1>
      <Button href="/">Go Back to Home</Button>
    </Container>
  );
};

export default NotFound;
