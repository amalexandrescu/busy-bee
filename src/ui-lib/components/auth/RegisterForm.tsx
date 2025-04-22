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
        <Card>
          <CardHeader
            title="Register"
            subheader={
              <Typography variant="subtitle2" component="div">
                Already have an account? <Link href="/login">Log in</Link>
              </Typography>
            }
          />
          <CardContent>
            <Stack divider={<Divider />} spacing={3}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Name</InputLabel>
                  <OutlinedInput
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>
                  Create account
                </Button>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">{success}</Typography>}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterForm;
