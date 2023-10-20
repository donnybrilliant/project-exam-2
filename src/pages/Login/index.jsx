import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("login");
  };
  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Typography>Login</Typography>

      <Avatar sx={{ width: "100px", height: "100px", my: 4, mx: "auto" }} />

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
          Sign In
        </Button>
      </Box>
      <Link component={RouterLink} to={"/register"}>
        {"Don't have an account? Register"}
      </Link>
    </Container>
  );
};

export default Login;
