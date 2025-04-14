import { Box, Container, styled } from "@mui/material";
import React from "react";
import LogInForm from "../../ui-lib/components/auth/LoginForm";

const ContentStyle = styled("div")(() => ({
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
}));

const LogIn = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm">
          <ContentStyle>
            <LogInForm />
          </ContentStyle>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default LogIn;
