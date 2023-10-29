import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Snackbar, AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const KamarUpdate = () => {
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
        `https://p3l-10683.et.r.appspot.com/api/v1/kamar/updateKamar/${id}`,
        {
          jenisKamar: values.jenisKamar,
          jenisBed: values.jenisBed,
          kapasitas: values.kapasitas,
          luas: values.luas,
          fasilitas: values.fasilitas,
          jumlah_bed: values.jumlah_bed,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setErrorMessage(result.data.message);
          alert(errorMessage);
          navigate("/kamarupdate");
        } else {
          alert("Berhasil mengubah Kamar!.");
          navigate("/kamar");
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
        `https://p3l-10683.et.r.appspot.com/api/v1/kamar/getKamarByID/${id}`,
        config
      );

      const kamarData = response.data.data.kamar; // Access the data property of the response

      // Set the initial values with the fetched data
      setInitialValues({
        jenisKamar: kamarData.jenisKamar,
        jenisBed: kamarData.jenisBed,
        kapasitas: kamarData.kapasitas,
        luas: kamarData.luas,
        fasilitas: kamarData.fasilitas,
        jumlah_bed: kamarData.jumlah_bed,
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
      <Header title="Update Kamar" subtitle="Change your Kamar" />

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
  jenisKamar: yup.string().required("Jenis Kamar is required"),
  jenisBed: yup.string().required("Jenis Bed is required"),
  kapasitas: yup.number().required("Kapasitas is required"),
  luas: yup.number().required("Luas is required"),
  fasilitas: yup.string().required("Fasilitas is required"),
  jumlah_bed: yup.number().required("Jumlah Bed is required"),
});

export default KamarUpdate;
