import React, { useEffect, useState } from "react";
import { Box, Button, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const KamarCreate = () => {
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
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/addKamar",
        // `http://localhost:6000/api/v1/kamar/addKamar`,
        {
          jenisKamar: values.jenisKamar,
          jenisBed: values.jenisBed,
          kapasitas: values.kapasitas,
          luas: values.luas,
          fasilitas: values.fasilitas,
          jumlah_bed: values.jumlah_bed,
          // nomor_kamar: values.nomor_kamar,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setErrorMessage(result.data.message);
          alert(errorMessage);
          navigate("/kamarcreate");
        } else {
          alert("Berhasil menambah Kamar!.");
          navigate("/kamar");
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
      <Header title="Create Kamar" subtitle="Create a new Kamar" />

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
                label="Jenis Kamar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jenisKamar}
                name="jenisKamar"
                error={!!touched.jenisKamar && !!errors.jenisKamar}
                helperText={touched.jenisKamar && errors.jenisKamar}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Jenis Bed"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jenisBed}
                name="jenisBed"
                error={!!touched.jenisBed && !!errors.jenisBed}
                helperText={touched.jenisBed && errors.jenisBed}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Kapasitas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.kapasitas}
                name="kapasitas"
                error={!!touched.kapasitas && !!errors.kapasitas}
                helperText={touched.kapasitas && errors.kapasitas}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Luas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.luas}
                name="luas"
                error={!!touched.luas && !!errors.luas}
                helperText={touched.luas && errors.luas}
                sx={{ gridColumn: "span 5" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Fasilitas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fasilitas}
                name="fasilitas"
                error={!!touched.fasilitas && !!errors.fasilitas}
                helperText={touched.fasilitas && errors.fasilitas}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Jumlah Bed"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jumlah_bed}
                name="jumlah_bed"
                error={!!touched.jumlah_bed && !!errors.jumlah_bed}
                helperText={touched.jumlah_bed && errors.jumlah_bed}
                sx={{ gridColumn: "span 7" }}
              />
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nomor Kamar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomor_kamar}
                name="nomor_kamar"
                error={!!touched.nomor_kamar && !!errors.nomor_kamar}
                helperText={touched.nomor_kamar && errors.nomor_kamar}
                sx={{ gridColumn: "span 7" }}
              /> */}
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
  jenisKamar: yup.string().required("Jenis Kamar is required"),
  jenisBed: yup.string().required("Jenis Bed is required"),
  kapasitas: yup.number().required("Kapasitas is required"),
  luas: yup.number().required("Luas is required"),
  fasilitas: yup.string().required("Fasilitas is required"),
  jumlah_bed: yup.number().required("Jumlah Bed is required"),
  // nomor_kamar: yup.string().required("Nomor Kamar is required"),
});
const initialValues = {
  jenisKamar: "",
  jenisBed: "",
  kapasitas: "",
  luas: "",
  fasilitas: "",
  jumlah_bed: "",
  // nomor_kamar: "",
};

export default KamarCreate;
