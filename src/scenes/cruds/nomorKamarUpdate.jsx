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
import { useNavigate, useParams } from "react-router-dom";

const NomorKamarUpdate = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialValues, setInitialValues] = useState({
    kamarId: "", // Default value, you can adjust it based on your requirements
    nomor_kamar: "",
  });
  const [kamarOptions, setKamarOptions] = useState([]);

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
      const response = await axios.put(
        `http://35.198.205.6:5000/api/v1/kamar/updateNomorKamar/${id}`,
        {
          kamarId: values.kamarId,
          nomor_kamar: values.nomor_kamar,
        },
        config
      );

      if (response.data.error) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        navigate("/nomorkamarupdate");
      } else {
        alert("Berhasil mengubah Kamar!.");
        setSnackbarMessage("Berhasil mengubah Kamar!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/nomorkamar");
      }
    } catch (error) {
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
    }
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
        .get("http://35.198.205.6:5000/api/v1/kamar/getAllKamar", config)
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

  useEffect(() => {
    const fetchInitialValues = async (id, currentUserToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      };

      try {
        const response = await axios.get(
          `http://35.198.205.6:5000/api/v1/kamar/getNomorKamarByID/${id}`,
          config
        );
        const kamarData = response.data.data.kamar;

        // Set the initial values with the fetched data
        setInitialValues((prevValues) => ({
          ...prevValues,
          kamarId: kamarData.Kamar.id,
          nomor_kamar: kamarData.nomor_kamar,
        }));

        // The log inside this block will more reliably show the updated state
        console.log({
          kamarId: kamarData.Kamar.id,
          nomor_kamar: kamarData.nomor_kamar,
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

      <Header title="Update Nomor Kamar" subtitle="Update Nomor Kamar" />

      <Formik
        enableReinitialize={true}
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
                value={values.kamarId || ""}
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
  kamarId: yup.string().required("Kamar is required"),
  nomor_kamar: yup.number().required("Nomor Kamar is required"),
});
export default NomorKamarUpdate;
