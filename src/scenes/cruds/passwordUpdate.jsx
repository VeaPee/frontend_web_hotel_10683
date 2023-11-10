import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Snackbar, AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordUpdate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  //   Message
  const [errorMessage, setErrorMessage] = useState("");

  const [token, setToken] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = async (values, currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      };

      const result = await axios.put(
        "https://p3l-10683.et.r.appspot.com/api/v1/akun/edit-password",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          passwordConfirmation: values.passwordConfirmation,
        },
        config
      );

      console.log(result);

      if (result.data.error === true) {
        setErrorMessage(result.data.message);
        alert(errorMessage);
        navigate("/updatepassword");
      } else {
        alert("Ubah Password Berhasil! Please Login to proceed.");
        navigate("/logout");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.status) {
        const errorMessage = error.response.data.message;
        setSnackbarMessage(errorMessage);
      } else {
        setSnackbarMessage("An error occurred. Please try again later.");
      }
    
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const getCurrentUserToken = () => {
    // Implement the function to retrieve the token for the current user
    // Return the token here
    return localStorage.getItem("token");
  };

  useEffect(() => {
    // Get the token for the current user from your authentication system
    const currentUserToken = getCurrentUserToken();
    console.log(currentUserToken);
    setToken(currentUserToken);
  }, []);

  //   useEffect(() => {
  //     if (token) {
  //       handleFormSubmit(token);
  //     }
  //   }, [token]);

  return (
    <Box m="20px">
      <Header title="Update Password" subtitle="Change your Password!" />

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
        onSubmit={(values) => handleFormSubmit(values, token)}
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
                type="password"
                label="Old Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.oldPassword}
                name="oldPassword"
                error={!!touched.oldPassword && !!errors.oldPassword}
                helperText={
                  errorMessage || (touched.oldPassword && errors.oldPassword)
                }
                sx={{
                  gridColumn: "span 2",
                  "& .MuiFormHelperText-root": {
                    color: "red", // Set the color to red
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password Baru"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.newPassword}
                name="newPassword"
                error={!!touched.newPassword && !!errors.newPassword}
                helperText={
                  errorMessage || (touched.newPassword && errors.newPassword)
                }
                sx={{
                  gridColumn: "span 3",
                  "& .MuiFormHelperText-root": {
                    color: "red", // Set the color to red
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Konfirmasi Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirmation}
                name="passwordConfirmation"
                error={
                  !!touched.passwordConfirmation &&
                  !!errors.passwordConfirmation
                }
                helperText={
                  errorMessage ||
                  (touched.passwordConfirmation && errors.passwordConfirmation)
                }
                sx={{
                  gridColumn: "span 3",
                  "& .MuiFormHelperText-root": {
                    color: "red", // Set the color to red
                  },
                }}
              />
            </Box>

            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Update Password
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Password is required"),
  newPassword: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must not exceed 20 characters"),
  passwordConfirmation: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must not exceed 20 characters")
    .oneOf(
      [yup.ref("newPassword")],
      "Password confirmation harus sama dengan Password Baru"
    ),
});
const initialValues = {
  oldPassword: "",
  newPassword: "",
  passwordConfirmation: "",
};

export default PasswordUpdate;
