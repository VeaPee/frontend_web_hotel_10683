import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Snackbar, AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SeasonUpdate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  // Popup
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const handleFormSubmit = async (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };
  
    try {
      const response = await axios.put(
        `http://35.198.205.6:5000/api/v1/season/updateSeason/${id}`,
        {
          jenis_season: values.jenis_season,
          tanggal_awal: values.tanggal_awal,
          tanggal_akhir: values.tanggal_akhir,
          perubahan_harga: values.perubahan_harga,
        },
        config
      );
  
      if (response.data.error) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        alert("Berhasil mengubah Season!.");
        setSnackbarMessage("Berhasil mengubah Season!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/season");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        setSnackbarMessage(errorMessage);
      } else {
        setSnackbarMessage("An error occurred. Please try again later.");
      }
    
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
        `http://35.198.205.6:5000/api/v1/season/getSeasonByID/${id}`,
        config
      );

      const seasonData = response.data.data.season; // Access the data property of the response

      // Set the initial values with the fetched data
      setInitialValues({
        jenis_season: seasonData.jenis_season,
        tanggal_awal: seasonData.tanggal_awal,
        tanggal_akhir: seasonData.tanggal_akhir,
        perubahan_harga: seasonData.perubahan_harga,
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
      <Header title="Update Season" subtitle="Change your Season" />

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert severity={snackbarSeverity}>
          <AlertTitle>{snackbarSeverity === "error" ? "Error" : "Success"}</AlertTitle>
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
                type="text"
                label="Jenis Season"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jenis_season}
                name="jenis_season"
                error={!!touched.jenis_season && !!errors.jenis_season}
                helperText={touched.jenis_season && errors.jenis_season}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Tanggal Awal"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tanggal_awal}
                name="tanggal_awal"
                error={!!touched.tanggal_awal && !!errors.tanggal_awal}
                helperText={touched.tanggal_awal && errors.tanggal_awal}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Tanggal Akhir"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tanggal_akhir}
                name="tanggal_akhir"
                error={!!touched.tanggal_akhir && !!errors.tanggal_akhir}
                helperText={touched.tanggal_akhir && errors.tanggal_akhir}
                sx={{ gridColumn: "span 5" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Perubahan Harga"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.perubahan_harga}
                name="perubahan_harga"
                error={!!touched.perubahan_harga && !!errors.perubahan_harga}
                helperText={touched.perubahan_harga && errors.perubahan_harga}
                sx={{ gridColumn: "span 6" }}
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
    jenis_season: yup.string().required("Jenis Season is required"),
    tanggal_awal: yup.date().required("Tanggal Awal is required"),
    tanggal_akhir: yup.date().required("Tanggal Akhir is required"),
    perubahan_harga: yup.number().required("Perubahan is required"),
  });

export default SeasonUpdate;
