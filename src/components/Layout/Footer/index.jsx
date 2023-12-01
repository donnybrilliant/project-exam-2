import { Toolbar, Typography, Container } from "@mui/material";

// This component is used to display a footer with a toggle color mode button
const Footer = () => {
  return (
    <footer>
      <Container maxWidth="false">
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "20vw",
            opacity: 0.1,
          }}
        >
          Holidaze
        </Typography>
        <Toolbar
          sx={{
            mt: 10,
            mb: 2,
            flexDirection: "column",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            All bookings on Holidaze are for whole days.
          </Typography>
          <Typography variant="body2">
            You can check in at 00.01 and check out 23.59 - if you want.
          </Typography>
          <Typography variant="body2">
            We can't be contacted - contact the venue owner directly after
            booking.
          </Typography>
          <Typography variant="body2">No privacy, no policy.</Typography>
        </Toolbar>
      </Container>
    </footer>
  );
};

export default Footer;
