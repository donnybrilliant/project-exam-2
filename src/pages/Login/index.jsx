import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useFetchStore, useAuthStore } from "../../stores";
import {
  Container,
  Typography,
  Box,
  TextField,
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

  // This function is used to login the user
  const handleLogin = async (event) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Helmet>
        <title>Login - Holidaze</title>
        <meta name="description" content="Login to your Holidaze account" />
      </Helmet>
      <Typography variant="h1">Login</Typography>

      <Avatar sx={{ width: "100px", height: "100px", my: 4, mx: "auto" }} />

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          type="email"
          label="Email Address"
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
        Don&apos;t have an account? Register here
      </Link>
    </Container>
  );
};

export default Login;
