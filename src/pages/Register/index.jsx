import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useFetchStore, useAuthStore } from "../../stores";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Container,
  Typography,
  Box,
  TextField,
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
  const isLoading = useFetchStore((state) => state.isLoading);
  const errorMsg = useFetchStore((state) => state.errorMsg);
  const login = useAuthStore((state) => state.login);
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);
  const register = useAuthStore((state) => state.register);
  const [emailError, setEmailError] = useState("");

  // This function is used to register the user and then login
  const handleRegister = async (event) => {
    event.preventDefault();
    // Check if the email ends with '@stud.noroff.no'
    if (!email.endsWith("@stud.noroff.no")) {
      setEmailError("Email must be a Noroff student email");
      return;
    } else {
      setEmailError(""); // Clear error message if the format is correct
    }

    // Register the user and then login
    const registered = await register(name, email, password, avatar);
    if (registered) {
      await login(email, password);
    }
  };

  // This function is used to toggle the avatar field
  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  return (
    <Container sx={{ textAlign: "center" }} maxWidth={"sm"}>
      <Helmet>
        <title>Register - Holidaze</title>
        <meta name="description" content="Register your new Holidaze account" />
      </Helmet>
      <Typography variant="h1">Register</Typography>
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
            label="Avatar URL"
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
          inputProps={{ minLength: 3 }}
        />
        <TextField
          error={emailError.length > 0}
          helperText={emailError}
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (
              e.target.value.endsWith("@stud.noroff.no") ||
              e.target.value === ""
            ) {
              setEmailError("");
            }
          }}
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
          inputProps={{ minLength: 8 }}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ my: 3 }}
          loading={isLoading}
        >
          Register
        </LoadingButton>
      </Box>
      <Link component={RouterLink} to={"/login"}>
        Already have an account? Login
      </Link>
      {errorMsg && <Typography>{errorMsg}</Typography>}
    </Container>
  );
};

export default Register;
