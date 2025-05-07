import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { signUp } from "../../../firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";

function RegisterForm(): React.JSX.Element {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!name.trim()) {
      setError("Name is required.");
      setSuccess("");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      setSuccess("");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      setSuccess("");
      return;
    }

    try {
      await signUp(name, email, password);
      setError(""); // Clear any previous errors
      setSuccess("Account created successfully! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after registration
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error: any) {
      setError("Failed to create an account. Please try again.");
      setSuccess(""); // Clear success message if there's an error
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            px: 2,
            py: 4,
          }}
        >
          <CardHeader
            title="Register"
            subheader={
              <Typography variant="body2" component="div">
                Already have an account?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: "#4e36f5", fontWeight: 500 }}
                >
                  Log in
                </Link>
              </Typography>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel
                  htmlFor="name"
                  sx={{
                    "&.Mui-focused": {
                      color: "#6a5af9",
                    },
                  }}
                >
                  Name
                </InputLabel>
                <OutlinedInput
                  id="name"
                  name="name"
                  required
                  value={name}
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    height: 40,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6a5af9",
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel
                  htmlFor="email"
                  sx={{
                    "&.Mui-focused": {
                      color: "#6a5af9",
                    },
                  }}
                >
                  Email address
                </InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email address"
                  sx={{
                    height: 40,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6a5af9",
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel
                  htmlFor="password"
                  sx={{
                    "&.Mui-focused": {
                      color: "#6a5af9",
                    },
                  }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    height: 40,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6a5af9",
                    },
                  }}
                />
              </FormControl>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ bgcolor: "#4e36f5" }}
              >
                Create account
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              {success && <Typography color="primary">{success}</Typography>}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterForm;
