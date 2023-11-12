import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
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

const NomorKamarCreate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [kamarOptions, setKamarOptions] = useState([]);

  const handleFormSubmit = (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .post(
        // "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/kamar/addKamar",
        `http://localhost:6000/api/v1/kamar/addNomorKamar`,
        {
          kamarId: values.kamarId,
          nomor_kamar: values.nomor_kamar,
        },
        config
      )
      .then((result) => {
        console.log(result);
        if (result.data.error === true) {
          setSnackbarMessage(response.data.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          navigate("/nomorkamarcreate");
        } else {
          alert("Berhasil menambah Kamar!.");
          setSnackbarMessage("Berhasil menambah Kamar!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          navigate("/nomorkamar");
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const errorMessage = error.response.data.message;
          setSnackbarMessage(errorMessage);
        } else {
          setSnackbarMessage("An error occurred. Please try again later.");
        }

        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    const fetchInitialValuesKamar = async (currentUserToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      };
      // Fetch the kamar options from the backend API
      axios
        .get("http://localhost:6000/api/v1/kamar/getAllKamar", config)
        .then((response) => {
          setKamarOptions(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
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

      <Header title="Create Nomor Kamar" subtitle="Create a new Nomor Kamar" />

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
                type="text"
                label="Nomor Kamar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomor_kamar}
                name="nomor_kamar"
                error={!!touched.nomor_kamar && !!errors.nomor_kamar}
                helperText={touched.nomor_kamar && errors.nomor_kamar}
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
  kamarId: yup.string().required("Kamar is required"),
  nomor_kamar: yup.number().required("Nomor Kamar is required"),
});
const initialValues = {
  kamarId: "",
  nomor_kamar: "",
};

export default NomorKamarCreate;
