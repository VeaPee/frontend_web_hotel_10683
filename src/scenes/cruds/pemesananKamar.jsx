import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Snackbar,
} from "@material-ui/core";
import { AlertTitle } from "@mui/material";
import { Formik } from "formik";
import Alert from "@mui/material/Alert";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PemesananKamarPage = () => {
  const location = useLocation();
  const cart = location?.state?.cart || [];
  const tanggalAwal = location?.state?.dataTanggalAwal || "";
  const tanggalAkhir = location?.state?.dataTanggalAkhir || "";
  const calculatedHarga = location?.state?.calculatedHarga;

  const navigate = useNavigate();
  console.log(cart);
  console.log(calculatedHarga);
  const [token, setToken] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [reservasiId, setReservasiId] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!cart || cart.length === 0) {
    return (
      <div>
        <Typography variant="h4" align="center" gutterBottom>
          Pemesanan Kamar
        </Typography>
        <Typography variant="h6" align="center">
          Tidak ada kamar yang dipilih.
        </Typography>
      </div>
    );
  }

  useEffect(() => {
    const currentUserToken = getCurrentUserToken();
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    const handleReservation = async () => {
      if (reservasiId) {
        console.log("ReservasiId:", reservasiId);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          console.log("SUBTOTAL = ", calculatedHarga)
          for (const kamar of cart) {
            const responseKamar = await axios.post(
              "http://localhost:6000/api/v1/transaksi/transaksiKamar",
              {
                reservasiId: reservasiId,
                kamarId: kamar.id,
                jumlah: 1,
                subtotal: calculatedHarga[cart.indexOf(kamar)],
              },
              config
            );

            console.log(responseKamar);
          }

        } catch (error) {
          console.log(error);
        }
      }
    };

    handleReservation(); // Call the function when reservasiId changes

  }, [reservasiId, cart, calculatedHarga, token]);

  const handleFormSubmit = async (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:6000/api/v1/transaksi/transaksiReservasi",
        {
          check_in: tanggalAwal,
          check_out: tanggalAkhir,
          jumlahDewasa: values.jumlahDewasa,
          jumlahAnakAnak: values.jumlahAnakAnak,
        },
        config
      );

      console.log(response);
      setReservasiId(response.data.data.id);
      if (response.data.error) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        // alert("Berhasil menambah Reservasi!.");
        const newReservasiId = response.data.data.id;

        setReservasiId(newReservasiId);
        console.log("Reservasi ID:", newReservasiId);
        
        setSnackbarMessage("Berhasil menambah Reservasi!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/pemesananFasilitas", {
          state: {
            cart,
            tanggalAwal,
            tanggalAkhir,
            calculatedHarga,
            reservasiId: response.data.data.id,
          },
        });
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





  const getCurrentUserToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <Box
      m="20px"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
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
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <div>
            <Typography variant="h4" align="center" gutterBottom>
              Pemesanan Kamar
            </Typography>
            <Typography variant="h6" align="center">
              {tanggalAwal} - {tanggalAkhir}
            </Typography>
            {cart.map((kamar, index) => (
              <Card
                key={kamar.id}
                style={{ margin: "auto", marginTop: "10px" }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    {kamar.jenisKamar}
                  </Typography>
                  <Typography variant="body1">
                    Jenis Bed: {kamar.jenisBed}
                  </Typography>
                  <Typography variant="body1">
                    Jumlah Bed: {kamar.jumlah_bed}
                  </Typography>
                  <Typography variant="body1">
                    Kapasitas: {kamar.kapasitas} Orang
                  </Typography>
                  <Typography variant="body1">
                    Harga: Rp. {calculatedHarga[index]}
                  </Typography>
                  {/* Add more details as needed */}
                </CardContent>
              </Card>
            ))}
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              Jumlah Penginap
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <TextField
                label="Jumlah Dewasa"
                type="number"
                name="jumlahDewasa"
                value={values.jumlahDewasa}
                onChange={handleChange}
                error={touched.jumlahDewasa && Boolean(errors.jumlahDewasa)}
                helperText={touched.jumlahDewasa && errors.jumlahDewasa}
              />
              <TextField
                label="Jumlah Anak-Anak"
                type="number"
                name="jumlahAnakAnak"
                value={values.jumlahAnakAnak}
                onChange={handleChange}
                error={touched.jumlahAnakAnak && Boolean(errors.jumlahAnakAnak)}
                helperText={touched.jumlahAnakAnak && errors.jumlahAnakAnak}
              />
            </Grid>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "80px",
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  jumlahDewasa: yup.number().required("Jumlah Dewasa is required"),
  jumlahAnakAnak: yup.number().required("Jumlah Anak-Anak is required"),
});

const initialValues = {
  jumlahDewasa: "",
  jumlahAnakAnak: "",
};

export default PemesananKamarPage;
