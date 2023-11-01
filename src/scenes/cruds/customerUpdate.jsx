import React, { useEffect, useState } from "react";
import { Box, Button, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CustomerUpdate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

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

  const handleFormSubmit = async (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .put(
        `https://p3l-10683.et.r.appspot.com/api/v1/customer/updateCustomer/${id}`,
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
          alert("Berhasil mengubah Customer!.");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchInitialValues = async (id, currentUserToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      };

      try {
        const response = await axios.get(
          `https://p3l-10683.et.r.appspot.com/api/v1/customer/getCustomerByID/${id}`,
          config
        );

        const customerData = response.data.data.customer; // Access the data property of the response

        // Set the initial values with the fetched data
        setInitialValues({
            jenis_customer: customerData.jenis_customer,
            nama_customer: customerData.nama_customer,
            nama_institusi: customerData.nama_institusi,
            nomor_identitas: customerData.nomor_identitas,
            nomor_telepon: customerData.nomor_telepon,
            email: customerData.email,
            alamat: customerData.alamat,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const initializeForm = async () => {
      await fetchInitialValues(id, token);
    };

    initializeForm();
  }, [id, token]);

  //   useEffect(() => {
  //     fetchInitialValues(id,token);
  //   }, [id,token]);

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Box m="20px">
      <Header title="Update Customer" subtitle="Change your Customer Data" />

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
                label="Jenis Customer"
                value={values.jenis_customer}
                name="jenis_customer"
                error={!!touched.jenis_customer && !!errors.jenis_customer}
                helperText={touched.jenis_customer && errors.jenis_customer}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

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
                Update
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

export default CustomerUpdate;
