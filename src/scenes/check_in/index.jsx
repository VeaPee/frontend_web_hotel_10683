import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  AlertTitle,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const CheckIn = () => {
  // Static Nomor Rekening
  const navigate = useNavigate();
  const nomorRekening = "770011770022";
  const { id } = useParams();
  const [proofOfPayment, setProofOfPayment] = useState(null);

  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Popup
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (currentUserToken) => {
    console.log(token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(currentUserToken);
    console.log("Request Headers:", config.headers);
    try {
      const response = await axios.put(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/transaksi/checkIn/${id}`,
        null,
        config
      );

      if (response.data.error) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setProofOfPayment(null);
        navigate(`/listreservasi`);
        // navigate("/");
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

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };
      setIsLoading(true);
      const response = await axios.get(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi/${id}`,
        config
      );

      console.log(response);
      const transformedData =
        response.data.error === false
          ? [
              {
                id: response.data.data.id,
                customerId: response.data.data.customerId,
                pegawaiId: response.data.data.pegawaiId,
                tanggal_reservasi: response.data.data.tanggal_reservasi,
                check_in: response.data.data.check_in,
                check_out: response.data.data.check_out,
                jumlahDewasa: response.data.data.jumlahDewasa,
                jumlahAnakAnak: response.data.data.jumlahAnakAnak,
                status: response.data.data.status,
                prefix_reservasi: response.data.data.prefix_reservasi,

                NotaPelunasan: response.data.data.NotaPelunasan.map(
                  (dataNota) => ({
                    no_invoice: dataNota.no_invoice,
                    tax: dataNota.tax,
                    subtotal: dataNota.subtotal,
                    jaminan: dataNota.jaminan,
                    depositNota: dataNota.deposit,
                    cash: dataNota.no_invoice,
                  })
                ),

                Customer: {
                  id: response.data.data.Customer.id,
                  nama_customer: response.data.data.Customer.nama_customer,
                },
              },
            ]
          : [];

      console.log(transformedData);
      console.log(transformedData.length);
      setTransformedData(transformedData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleOpenConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const handleConfirmPayment = () => {
    handleCloseConfirmationDialog();
    handleSubmit(token);
  };

  const getCurrentUserToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const currentUserToken = getCurrentUserToken();
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  return (
    <Box m="20px">
      <Header title="Check In" subtitle="Mengonfirmasi Check In Customer" />

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
          <Typography>
            Are you sure you want to confirm the Check In?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPayment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        {/* Center the content vertically and horizontally */}
        <Card>
          <CardContent>
            <Typography variant="h5" mb={2}>
              Check In
            </Typography>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Nama Customer
                </Typography>
                <Typography variant="h4">
                  {transformedData.length > 0
                    ? transformedData[0].Customer.nama_customer
                    : "Customer information not available"}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  ID Transaksi
                </Typography>
                <Typography variant="h4">
                  {transformedData.length > 0
                    ? transformedData[0].prefix_reservasi
                    : "Information not available"}
                </Typography>
              </CardContent>
            </Card>

            {!isLoading && transformedData.length > 0 ? (
              <>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" mb={2} textAlign="center">
                      Jumlah Deposit yang perlu dibayarkan
                    </Typography>
                    <Typography
                      variant="h3"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      Rp. 300.000
                    </Typography>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p>...</p>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenConfirmationDialog}
              style={{ display: "block", margin: "auto" }}
            >
              Konfirmasi Pembayaran
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default CheckIn;
