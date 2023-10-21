import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFetchStore } from "../../stores";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// This component is used to display a register page
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const errorMsg = useFetchStore((state) => state.errorMsg);

  // This function is used to register the user and then login
  const handleRegister = async (event) => {
    event.preventDefault();
    const register = await apiFetch("auth/register", "POST", {
      name,
      email,
      password,
    });
    if (register) {
      await login(email, password);
      navigate("/", { replace: true });
    }
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

      <Box component="form" onSubmit={handleRegister}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Username"
          name="name"
          autoComplete="username"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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

        <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
          Register
        </Button>
      </Box>
      <Link component={RouterLink} to={"/login"}>
        {"Already have an account? Login"}
      </Link>
      {errorMsg && <Typography>{errorMsg}</Typography>}
    </Container>
  );
};

export default Register;
