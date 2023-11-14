import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useFetchStore, useAuthStore } from "../../stores";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Avatar,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

// This component is used to display a login page
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const isLoading = useFetchStore((state) => state.isLoading);
  const navigate = useNavigate();
  const location = useLocation();

  // This function is used to login the user
  const handleLogin = async (event) => {
    event.preventDefault();
    const loggedIn = await login(email, password);
    const { from } = location.state || { from: { pathname: "/" } };
    if (loggedIn) navigate(from.pathname, { replace: true });
  };

  document.title = "Login - Holidaze";

  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Typography>Login</Typography>

      <Avatar sx={{ width: "100px", height: "100px", my: 4, mx: "auto" }} />

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={isLoading}
          sx={{ my: 3 }}
        >
          Sign In
        </LoadingButton>
      </Box>
      <Link component={RouterLink} to={"/register"}>
        Don't have an account? Register
      </Link>
    </Container>
  );
};

export default Login;
