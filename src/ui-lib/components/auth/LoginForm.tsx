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
import { signIn } from "../../../firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";
// import {
//   deleteUser,
//   EmailAuthProvider,
//   getAuth,
//   reauthenticateWithCredential,
// } from "firebase/auth";

function LogInForm(): React.JSX.Element {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  // const [isUserDeleted, setIsUserDeleted] = React.useState<boolean>(false); // Track if user is deleted

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      await signIn(email, password);
      setError(""); // Clear any previous errors
      navigate("/dashboard"); // Redirect to the dashboard (or any other page after login)
    } catch (error: any) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  //disabled until I need delete user
  // const handleDeleteAccount = async (email: string, password: string) => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (!user) return;

  //   try {
  //     // Required: re-authenticate
  //     const credential = EmailAuthProvider.credential(email, password);
  //     await reauthenticateWithCredential(user, credential);
  //     await deleteUser(user); // This deletes the current user from Firebase Authentication
  //     setIsUserDeleted(true); // Set state to indicate user is deleted
  //     setSuccess("Your account has been deleted.");
  //     console.log("User deleted from Firebase Authentication");

  //     // Optionally, redirect user after deletion
  //     setTimeout(() => {
  //       navigate("/login"); // Redirect to login page after deletion
  //     }, 2000);
  //   } catch (error: any) {
  //     console.error("Error deleting user: ", error);
  //     setError("Failed to delete account.");
  //   }
  // };

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
            title="Log in"
            subheader={
              <Typography variant="body2" component="div">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: "#4e36f5", fontWeight: 500 }}
                >
                  Register
                </Link>
              </Typography>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={3}>
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
                sx={{
                  bgcolor: "#4e36f5",
                }}
              >
                Log in
              </Button>
              {/* disabled for now because I don't need the delete button */}
              {/* {!isUserDeleted && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteAccount(email, password)}
                  >
                    Delete Account
                  </Button>
                )} */}
              {error && <Typography color="error">{error}</Typography>}
              {success && <Typography color="primary">{success}</Typography>}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LogInForm;
