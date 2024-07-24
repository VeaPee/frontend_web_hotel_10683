import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    axios
      .post("http://35.198.205.6:5000/api/v1/auth/register", {
        username: values.username,
        password: values.password,
      })
      .then((result) => {
        console.log(result);
        if (result.data.message === "Username Sudah Ada") {
          alert("Username already registered! Please Login to proceed.");
          navigate("/login");
        } else {
          alert("Registered successfully!.");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box m="20px">
      <Header title="Register" subtitle="Create a new account" />

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
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must not exceed 20 characters"),
});
const initialValues = {
  username: "",
  password: "",
};

export default Register;
