import { Toolbar, Typography } from "@mui/material";

// This component is used to display a footer with a toggle color mode button
const Footer = () => {
  return (
    <Toolbar id="footer" sx={{ marginTop: 4, justifyContent: "space-between" }}>
      <Typography>Footer</Typography>
    </Toolbar>
  );
};

export default Footer;
