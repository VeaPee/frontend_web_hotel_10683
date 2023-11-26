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
import { Formik, useFormik } from "formik";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DetailRiwayatTransaksi from "../cruds/readDetailRiwayatTransaksi"

const TambahinFasilitas = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [dataNota, setDataNota] = useState([]);
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const reservasiId = id;

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  let subtotalNota = 0;
  let pajak = 0;

  
  const [showDetail, setShowDetail] = useState(false);

  const handleToggleDetail = () => {
    setShowDetail((prevShowDetail) => !prevShowDetail);
  };

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

      // Fasilitas
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


      // Nota Pelunasan
      const responseNota = await axios.get(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi/${id}`,
        config
      );

      const transformedDataNota = responseNota.data.data.NotaPelunasan.map((item) => ({
        id: item.id,
        subtotal: item.subtotal,
        cash: item.cash,
        tax: item.tax,
      }));

      console.log(transformedDataNota)
      setDataNota(transformedDataNota);

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

        subtotalNota = subtotalNota + facility.subtotal;

      }
      console.log("Subtotal Nota", subtotalNota)

      pajak = subtotalNota * 0.1;

      const responseNota = await axios.put(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/transaksi/tambahFasilitasNota/${id}`,
        {
          reservasiId: reservasiId,
          subtotal: dataNota[0].subtotal + subtotalNota + pajak,
          cash: dataNota[0].cash + subtotalNota + pajak,
          tax: dataNota[0].tax + pajak
        },
        config
      );

      console.log("Nota : ",responseNota);

      setSnackbarMessage("Berhasil menambah Fasilitas!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate(`/listreservasi`);
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

  const handleOpenConfirmationDialog = (values) => {
    formik.setValues(values); // Update formik values
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const handleConfirm = () => {
    handleCloseConfirmationDialog();
    handleFormSubmit(formik.values);
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

  // Use useFormik to manage form state
  const formik = useFormik({
    onSubmit: (values) => handleFormSubmit(values, token),
    initialValues: {
      quantities: Object.fromEntries(
        data.map((facility) => [facility.id, 0])
      ),
    },
    // Add your validation schema if needed
  });

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

      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCloseConfirmationDialog}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm this?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Header title="Tambah Fasilitas" />

      {/* Button to toggle DetailRiwayatTransaksi */}
      <Button onClick={handleToggleDetail}>
        {showDetail ? "Hide Details" : "Show Details"}
      </Button>

      {/* Conditionally render DetailRiwayatTransaksi */}
      {showDetail && <DetailRiwayatTransaksi />}

      <Formik {...formik}>
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
                variant="contained"
                color="primary"
                onClick={() => handleOpenConfirmationDialog(values)}
                style={{ display: "block", margin: "auto" }}
              >
                Submit
              </Button>

              <Button
                onClick={() => navigate(`/listreservasi`)}
                color="primary"
                variant="contained"
                sx={{ color: "white" }}
              >
                Back
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TambahinFasilitas;
