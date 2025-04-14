import { Box, Container, styled } from "@mui/material";
import React from "react";
import RegisterForm from "../../ui-lib/components/auth/RegisterForm";

const ContentStyle = styled("div")(() => ({
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
}));

const Register = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm">
          <ContentStyle>
            <RegisterForm />
          </ContentStyle>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default Register;
