import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const PemesananFasilitasPageGrup = () => {
  const location = useLocation();
  const cart = location?.state?.cart || [];
  const tanggalAwal = location?.state?.tanggalAwal || "";
  const tanggalAkhir = location?.state?.tanggalAkhir || "";
  const calculatedHarga = location?.state?.calculatedHarga;
  const reservasiId = location?.state?.reservasiId;

  // console.log(cart)
  // console.log(tanggalAwal)
  // console.log(tanggalAkhir)
  // console.log(calculatedHarga)
  // console.log(reservasiId)

  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [token, setToken] = useState("");
  const [data, setData] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      const response = await axios.get(
        "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/fasilitas/getAllFasilitas",
        config
      );

      const transformedData = response.data.data.map((item) => ({
        id: item.id,
        nama_fasilitas: item.nama_fasilitas,
        satuan: item.satuan,
        harga: item.harga,
      }));

      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const selectedFacilities = data
        .filter((facility) => values.quantities[facility.id] > 0)
        .map((facility) => ({
          reservasiId,
          fasilitasId: facility.id,
          jumlah: values.quantities[facility.id],
          subtotal: values.quantities[facility.id] * facility.harga,
        }));

      // Check if there are selected facilities
      if (selectedFacilities.length === 0) {
        setSnackbarMessage("Please select at least one facility.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      // Send each facility individually to the server
      for (const facility of selectedFacilities) {
        const response = await axios.post(
          "https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/transaksi/transaksiFasilitas",
          facility,
          config
        );

        console.log(response);

        if (response.data.error) {
          console.error(response.data.message);
          setSnackbarMessage(response.data.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }
      }

      setSnackbarMessage("Berhasil menambah Fasilitas!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate(`/resumeReservasiGrup/${reservasiId}`, {
        state: {
          cart,
          tanggalAwal,
          tanggalAkhir,
          calculatedHarga,
          reservasiId,
        },
      });
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

  const getCurrentUserToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const currentUserToken = getCurrentUserToken();
    setToken(currentUserToken);

    if (currentUserToken) {
      fetchData(currentUserToken);
    }
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

      <Header title="Tambah Fasilitas" />

      <Formik
        onSubmit={(values) => handleFormSubmit(values, token)}
        initialValues={{
          quantities: Object.fromEntries(
            data.map((facility) => [facility.id, 0])
          ),
        }}
        // validationSchema={checkoutSchema}
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
            {data.map((facility) => (
              <Card key={facility.id}>
                <CardContent>
                  <Typography variant="h6">
                    {facility.nama_fasilitas}
                  </Typography>
                  <Typography variant="body1">
                    Harga: {facility.harga}
                  </Typography>
                  <TextField
                    type="number"
                    label="Jumlah"
                    name={`quantities.${facility.id}`}
                    value={values.quantities[facility.id] || 0}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CardContent>
              </Card>
            ))}
            <Box display="flex" justifyContent="first" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Submit
              </Button>

              <Button
                onClick={() =>
                  navigate(`/resumeReservasiGrup/${reservasiId}`, {
                    state: {
                      cart,
                      tanggalAwal,
                      tanggalAkhir,
                      calculatedHarga,
                      reservasiId,
                    },
                  })
                }
                color="primary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Skip
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  quantities: {},
};
export default PemesananFasilitasPageGrup;
