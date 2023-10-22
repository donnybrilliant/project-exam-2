import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFetchStore, useAuthStore } from "../../stores";
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
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const apiFetch = useFetchStore((state) => state.apiFetch);
  const isLoading = useFetchStore((state) => state.isLoading);
  const errorMsg = useFetchStore((state) => state.errorMsg);
  const login = useAuthStore((state) => state.login);
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);

  // This function is used to register the user and then login
  const handleRegister = async (event) => {
    event.preventDefault();
    const register = await apiFetch("auth/register", "POST", {
      name,
      email,
      password,
      avatar,
    });
    if (register) {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    }
  };

  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Typography>Register</Typography>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ m: 4 }}
        badgeContent={
          <IconButton sx={{ bgcolor: "#d3d3d3" }} onClick={toggleAvatarField}>
            <EditIcon />
          </IconButton>
        }
      >
        <Avatar src={avatar} sx={{ width: "100px", height: "100px" }} />
      </Badge>

      <Box component="form" onSubmit={handleRegister}>
        {isAvatarFieldVisible && (
          <TextField
            margin="normal"
            fullWidth
            id="avatar"
            label="Avatar"
            name="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        )}

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
