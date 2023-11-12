import React, { useEffect, useState } from "react";
import { Box, Button, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerCreate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  const handleFormSubmit = (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .post(
        // `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/addCustomer`,
        `http://localhost:6000/api/v1/customer/addCustomer`,
        
        {
          nama_customer: values.nama_customer,
          nama_institusi: values.nama_institusi,
          nomor_identitas: values.nomor_identitas,
          nomor_telepon: values.nomor_telepon,
          email: values.email,
          alamat: values.alamat,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setErrorMessage(result.data.message);
          alert(errorMessage);
        } else {
          alert("Berhasil menambah Customer!.");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
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

  return (
    <Box m="20px">
      <Header title="Create Customer" subtitle="Create a new Customer" />

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
                type="text"
                label="Nama Customer"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_customer}
                name="nama_customer"
                error={!!touched.nama_customer && !!errors.nama_customer}
                helperText={touched.nama_customer && errors.nama_customer}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nama Institusi"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_institusi}
                name="nama_institusi"
                error={!!touched.nama_institusi && !!errors.nama_institusi}
                helperText={touched.nama_institusi && errors.nama_institusi}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nomor Identitas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomor_identitas}
                name="nomor_identitas"
                error={!!touched.nomor_identitas && !!errors.nomor_identitas}
                helperText={touched.nomor_identitas && errors.nomor_identitas}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nomor Telepon"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomor_telepon}
                name="nomor_telepon"
                error={!!touched.nomor_telepon && !!errors.nomor_telepon}
                helperText={touched.nomor_telepon && errors.nomor_telepon}
                sx={{ gridColumn: "span 5" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Alamat"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.alamat}
                name="alamat"
                error={!!touched.alamat && !!errors.alamat}
                helperText={touched.alamat && errors.alamat}
                sx={{ gridColumn: "span 7" }}
              />
            </Box>

            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  nama_customer: yup.string().required("Nama Customer is required"),
  nama_institusi: yup.string().required("Nama Institusi is required"),
  nomor_identitas: yup.string().required("Nomor Identitas is required"),
  nomor_telepon: yup
    .string()
    .required("Nomor Telepon is required")
    .matches(/^[0-9]{10,12}$/, "Nomor Telepon must be between 10 and 12 digits"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  alamat: yup.string().required("Alamat is required"),
});
const initialValues = {
  nama_customer: "",
  nama_institusi: "",
  nomor_identitas: "",
  nomor_telepon: "",
  email: "",
  alamat: "",
};

export default CustomerCreate;
