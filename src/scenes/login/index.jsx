import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  AlertTitle,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (snackbarOpen) {
      // Use setTimeout to delay the navigation and window reload
      const timeoutId = setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 3000); // Adjust the delay as needed (in milliseconds)

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [snackbarOpen]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = (values) => {
    axios
      .post(
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/auth/login",
        {
          username: values.username,
          password: values.password,
        }
      )
      .then((result) => {
        console.log(result);
        if (result.data.message === "success") {
          console.log("Login Success");
          localStorage.setItem("token", result.data.data.token);
          setSnackbarMessage("Login successful!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          // navigate("/");
          // window.location.reload();
        } else {
          setSnackbarMessage("Username atau Password Salah! Coba Lagi");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          setSnackbarMessage(errorMessage);
        } else {
          setSnackbarMessage("An error occurred. Please try again later.");
        }
      
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  
  return (
    <Box m="20px">
      <Header title="Login" subtitle="Login to your Account" />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarSeverity}>
          <AlertTitle>
            {snackbarSeverity === "error" ? "Error" : "Success"}
          </AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 3" }}
              />
            </Box>
            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Login
              </Button>
            </Box>

            <Typography variant="h6" sx={{ m: "15px" }}>
              Belum punya Akun?
            </Typography>
            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                color="primary"
                variant="contained"
                sx={{ color: "white" }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  username: "",
  password: "",
};

export default Login;
