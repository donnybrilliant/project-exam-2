import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Grid,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("register");
  };
  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Typography>Register</Typography>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ m: 4 }}
        badgeContent={
          <IconButton sx={{ bgcolor: "#d3d3d3" }}>
            <EditIcon />
          </IconButton>
        }
      >
        <Avatar sx={{ width: "100px", height: "100px" }} />
      </Badge>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
            />
          </Grid>
        </Grid>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
          Register
        </Button>
      </Box>
      <Link component={RouterLink} to={"/login"}>
        {"Already have an account? Sign Up"}
      </Link>
    </Container>
  );
};

export default Register;
