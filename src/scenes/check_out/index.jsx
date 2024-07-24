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
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import DetailRiwayatTransaksi from "../cruds/readDetailRiwayatTransaksi"

const CheckOut = () => {
  // Static Nomor Rekening
  const navigate = useNavigate();

  const { id } = useParams();

  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Popup
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const [inputUang, setInputUang] = useState("");

  const [showDetail, setShowDetail] = useState(false);

  const handleToggleDetail = () => {
    setShowDetail((prevShowDetail) => !prevShowDetail);
  };

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
        `http://35.198.205.6:5000/api/v1/transaksi/checkOut/${id}`,
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
        navigate(`/detailriwayat/${id}`);
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
        `http://35.198.205.6:5000/api/v1/customer/getRiwayatTransaksi/${id}`,
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
                    cash: dataNota.cash,
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

  //   const handleOpenConfirmationDialog = () => {
  //     setConfirmationDialogOpen(true);
  //   };
  const handleOpenConfirmationDialog = () => {
    if (transformedData[0].NotaPelunasan[0].cash < 0) {
      setConfirmationDialogOpen(true);
    } else {
      // Check if the input value matches the cash amount
      const cashAmount =
        transformedData.length > 0
          ? transformedData[0].NotaPelunasan[0].cash
          : 0;
      const inputUangValue = parseFloat(inputUang) || 0;

      if (inputUangValue !== cashAmount) {
        setSnackbarMessage("Input Uang harus sama dengan Cash.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      } else {
        setConfirmationDialogOpen(true);
      }
    }
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  //   const handleConfirmPayment = () => {
  //     handleCloseConfirmationDialog();
  //     handleSubmit(token);
  //   };

  const handleConfirmPayment = () => {
    handleCloseConfirmationDialog();

    if (transformedData[0].NotaPelunasan[0].cash < 0) {
      handleSubmit(token);
    } else {
      // Check if the input value still matches the cash amount
      const cashAmount =
        transformedData.length > 0
          ? transformedData[0].NotaPelunasan[0].cash
          : 0;
      const inputUangValue = parseFloat(inputUang) || 0;

      if (inputUangValue !== cashAmount) {
        setSnackbarMessage(
          "Input Uang Tidak Sama dengan Cash. Konfirmasi Gagal."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Continue with the payment confirmation logic
      handleSubmit(token);
    }
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

      <Header title="Check Out" subtitle="Mengonfirmasi Check Out Customer" />

      {/* Button to toggle DetailRiwayatTransaksi */}
      <Button onClick={handleToggleDetail}>
        {showDetail ? "Hide Details" : "Show Details"}
      </Button>

      {/* Conditionally render DetailRiwayatTransaksi */}
      {showDetail && <DetailRiwayatTransaksi />}

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
            Are you sure you want to confirm the Check Out?
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
              Check Out
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
                      Jumlah Cash (Minus Artinya Kembalian)
                    </Typography>
                    <Typography
                      variant="h3"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {transformedData.length > 0
                        ? transformedData[0].NotaPelunasan[0].cash
                        : "Information not available"}
                    </Typography>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p>...</p>
            )}

            {!isLoading &&
            transformedData.length > 0 &&
            transformedData[0].NotaPelunasan[0].cash >= 0 ? (
              <>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" mb={2} textAlign="center">
                      Inputkan Uang sesuai dengan Jumlah Cash!
                    </Typography>
                    <TextField
                      label="Input Uang"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={inputUang}
                      onChange={(e) => setInputUang(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Rp</InputAdornment>
                        ),
                      }}
                    />
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
              Konfirmasi
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default CheckOut;
