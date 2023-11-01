import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FasilitasCreate = () => {
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
        "https://p3l-10683.et.r.appspot.com/api/v1/fasilitas/addFasilitas",
        {
            nama_fasilitas: values.nama_fasilitas,
            satuan: values.satuan,
            harga: values.harga,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setErrorMessage(result.data.message);
          alert(errorMessage);
          navigate("/fasilitascreate");
        } else {
          alert("Berhasil menambah Fasilitas!.");
          navigate("/fasilitas");
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
      <Header title="Create Fasilitas" subtitle="Create a new Fasilitas" />

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
                label="Nama Fasilitas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_fasilitas}
                name="nama_fasilitas"
                error={!!touched.nama_fasilitas && !!errors.nama_fasilitas}
                helperText={touched.nama_fasilitas && errors.nama_fasilitas}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Satuan"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.satuan}
                name="satuan"
                error={!!touched.satuan && !!errors.satuan}
                helperText={touched.satuan && errors.satuan}
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Harga"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.harga}
                name="harga"
                error={!!touched.harga && !!errors.harga}
                helperText={touched.harga && errors.harga}
                sx={{ gridColumn: "span 4" }}
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
    nama_fasilitas: yup.string().required("Nama Fasilitas is required"),
    satuan: yup.number().required("Satuan Bed is required"),
    harga: yup.number().required("Harga is required"),
});
const initialValues = {
    nama_fasilitas: "",
    satuan: 1,
    harga: "",
};

export default FasilitasCreate;
