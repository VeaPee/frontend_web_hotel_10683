import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Select, MenuItem, Snackbar, AlertTitle  } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const tarifCreate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [kamarOptions, setKamarOptions] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = async (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    try {
      const response = await axios.post(
        "http://35.198.205.6:5000/api/v1/tarif/addTarif",
        {
          seasonId: values.seasonId,
          kamarId: values.kamarId,
          harga: values.harga,
        },
        config
      );

      if (response.data.error) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        alert("Berhasil menambah Tarif!.");
        setSnackbarMessage("Berhasil menambah Tarif!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/tarif");
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
    const fetchInitialValuesSeason = async (currentUserToken) => {
        const config = {
            headers: {
                Authorization: `Bearer ${currentUserToken}`,
            },
          };
        // Fetch the season options from the backend API
        axios
          .get("http://35.198.205.6:5000/api/v1/season/getAllSeason", config)
          .then((response) => {
            setSeasonOptions(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    const initializeFormSeason = async () => {
        await fetchInitialValuesSeason(token);
      };
    
      initializeFormSeason();
  }, [token]);

  
  useEffect(() => {
    const fetchInitialValuesKamar = async (currentUserToken) => {
        const config = {
            headers: {
                Authorization: `Bearer ${currentUserToken}`,
            },
          };
        // Fetch the kamar options from the backend API
        axios
          .get("http://35.198.205.6:5000/api/v1/kamar/getAllKamar", config)
          .then((response) => {
            setKamarOptions(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    const initializeFormKamar = async () => {
        await fetchInitialValuesKamar(token);
      };
    
      initializeFormKamar();
  }, [token]);

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
      <Header title="Create Tarif" subtitle="Create a new Tarif" />

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
              <Select
                fullWidth
                variant="filled"
                label="Season"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.seasonId}
                placeholder="Season"
                name="seasonId"
                error={!!touched.seasonId && !!errors.seasonId}
                helpertext={touched.seasonId && errors.seasonId}
                sx={{ gridColumn: "span 2" }}
              >
                {seasonOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jenis_season}
                  </MenuItem>
                ))}
              </Select>

              <Select
                fullWidth
                variant="filled"
                label="Kamar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.kamarId}
                placeholder="Kamar"
                name="kamarId"
                error={!!touched.kamarId && !!errors.kamarId}
                helpertext={touched.kamarId && errors.kamarId}
                sx={{ gridColumn: "span 2" }}
              >
                {kamarOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jenisKamar}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                fullWidth
                variant="filled"
                type="number"
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
  seasonId: yup.string().required("Season is required"),
  kamarId: yup.string().required("Kamar is required"),
  harga: yup.number().required("Harga is required"),
});
const initialValues = {
  seasonId: "",
  kamarId: "",
  harga: "",
};

export default tarifCreate;
