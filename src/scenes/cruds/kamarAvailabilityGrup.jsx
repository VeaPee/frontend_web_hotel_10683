import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  TextField,
  AlertTitle,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Modal } from "@material-ui/core";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import * as yup from "yup";
import Header from "../../components/Header";
import axios from "axios";
import { AddShoppingCart } from "@material-ui/icons";
import { useNavigate, Link, useParams } from "react-router-dom";

const KamarAvailabilityGrup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { id } = useParams();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [dataTanggalAwal, setDataTanggalAwal] = useState("");
  const [dataTanggalAkhir, setDataTanggalAkhir] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);

  const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);
  const [selectedCartItemToRemove, setSelectedCartItemToRemove] =
    useState(null);

  const calculateAdjustedHarga = (tarif) => {
    const adjustedHarga =
      tarif.harga - tarif.harga * tarif.Season.perubahan_harga;

    return adjustedHarga;
  };

  const [calculatedHarga, setCalculatedHarga] = useState([]);
  const [totalAdjustedHarga, setTotalAdjustedHarga] = useState([]);
  const diffDays =
      (new Date(dataTanggalAkhir) - new Date(dataTanggalAwal)) / (1000 * 60 * 60 * 24);
      
  // const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const handleFormSubmit = (values, currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .post(
        // "http://localhost:6000/api/v1/kamar/checkKamarAvailability",
        "http://35.198.205.6:5000/api/v1/kamar/checkKamarAvailability",
        {
          tanggalAwal: values.tanggalAwal,
          tanggalAkhir: values.tanggalAkhir,
        },
        config
      )
      .then((response) => {
        console.log(response);
        const transformedData = (response.data.data.kamar || []).map(
          (item) => ({
            id: item.id,
            jenisKamar: item.jenisKamar,
            jenisBed: item.jenisBed,
            kapasitas: item.kapasitas,
            luas: item.luas,
            fasilitas: item.fasilitas,
            jumlah_bed: item.jumlah_bed,
            nomor_kamar: item.nomor_kamar,
            Tarif: (item.Tarif || []).map((dataTarif) => ({
              id: dataTarif.id,
              seasonId: dataTarif.seasonId,
              kamarId: dataTarif.kamarId,
              harga: dataTarif.harga,
              Season: {
                id: dataTarif.Season.id,
                jenis_season: dataTarif.Season.jenis_season,
                tanggal_awal: dataTarif.Season.tanggal_awal,
                tanggal_akhir: dataTarif.Season.tanggal_akhir,
                perubahan_harga: dataTarif.Season.perubahan_harga,
              },
            })),
          })
        );

        console.log(transformedData);
        setData(transformedData);

        setDataTanggalAwal(values.tanggalAwal);
        setDataTanggalAkhir(values.tanggalAkhir);

        setSnackbarMessage("Berhasil Mencari!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
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
        } else if (error.message) {
          setSnackbarMessage(error.message);
        } else {
          setSnackbarMessage("An error occurred. Please try again later.");
        }

        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleConfirmDialogAction = (confirmed) => {
    if (confirmed) {
      const adjustedHarga = selectedCartItem.Tarif.reduce((acc, tarif) => {
        const tarifTanggalAwal = new Date(tarif.Season.tanggal_awal);
        const tarifTanggalAkhir = new Date(tarif.Season.tanggal_akhir);
        const searchTanggalAwal = new Date(dataTanggalAwal);
        const searchTanggalAkhir = new Date(dataTanggalAkhir);

        if (
          searchTanggalAwal >= tarifTanggalAwal &&
          searchTanggalAkhir <= tarifTanggalAkhir
        ) {
          if (tarif.Season.jenis_season !== "normal") {
            return calculateAdjustedHarga(tarif);
          } else if (!acc) {
            return tarif.harga;
          }
        }

        return acc;
      }, null);

      setCalculatedHarga([...calculatedHarga, (adjustedHarga * diffDays)]);

      const itemWithAdjustedHarga = {
        ...selectedCartItem,
        adjustedHarga: adjustedHarga,
      };

      setCart([...cart, itemWithAdjustedHarga]);

      setSnackbarMessage("Kamar berhasil ditambahkan ke keranjang");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }

    setConfirmDialogOpen(false);
    setSelectedCartItem(null);
  };

  const addToCart = (item) => {
    const isItemInCart = cart.some((cartItem) => cartItem.id === item.id);

    if (isItemInCart) {
      setSnackbarMessage("Kamar Sudah Ada di Keranjang");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSelectedCartItem(item);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveFromCart = (confirmed) => {
    if (confirmed) {
      const updatedCart = cart.filter(
        (item) => item.id !== selectedCartItemToRemove.id
      );
      setCart(updatedCart);

      setSnackbarMessage("Kamar berhasil dihapus dari keranjang");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setConfirmRemoveDialogOpen(false);
    setSelectedCartItemToRemove(null);
  };

  const removeFromCart = (itemId) => {
    setSelectedCartItemToRemove({ id: itemId });

    setConfirmRemoveDialogOpen(true);
  };

  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  // const openConfirmationDialog = () => {
  //   setConfirmationDialogOpen(true);
  // };

  // const closeConfirmationDialog = () => {
  //   setConfirmationDialogOpen(false);
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

  return (
    <Box m="20px">
      <Box m="20px">
        <Header title="Cek Ketersediaan Kamar" />

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

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={openCart}>
            Lanjut ke Keranjang
          </Button>
        </Box>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Modal open={cartOpen} onClose={closeCart}>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                  }}
                >
                  <Typography variant="h6">Keranjang:</Typography>
                  {cart.length === 0 ? (
                    <Typography variant="subtitle1">
                      Keranjang kosong
                    </Typography>
                  ) : (
                    cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            Jenis Kamar: {item.jenisKamar}
                          </Typography>
                          <Typography variant="subtitle1">
                            Jenis Bed: {item.jenisBed}
                          </Typography>
                          <Typography variant="subtitle1">
                            Jumlah Bed: {item.jumlah_bed}
                          </Typography>
                          <Typography variant="subtitle1">
                            Kapasitas: {item.kapasitas} Orang
                          </Typography>
                          <Typography variant="subtitle1">
                            Luas: {item.luas} m<sup>2</sup>
                          </Typography>
                          <Typography variant="subtitle1">
                            Fasilitas: {item.fasilitas}
                          </Typography>
                          <Typography variant="subtitle1">
                            Adjusted Harga: Rp. {item.adjustedHarga * diffDays}
                          </Typography>
                          <IconButton
                            color="secondary"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <DeleteIcon style={{ color: "red" }} />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  {cart.length !== 0 && (
                    <div>
                      {/* Use the navigate function to navigate to the "/pemesananKamar" route */}
                      <Button
                        onClick={() => {
                          console.log("Calculated Harga:", calculatedHarga);
                          navigate("/pemesananKamarGrup", {
                            state: {
                              cart,
                              dataTanggalAwal,
                              dataTanggalAkhir,
                              calculatedHarga,
                              id
                            },
                          });
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Konfirmasi
                      </Button>
                    </div>
                  )}
                </div>
              </Modal>
            </Grid>
          </Grid>
        </Container>

        <Dialog
          open={confirmRemoveDialogOpen}
          onClose={() => confirmRemoveFromCart(false)}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            Are you sure you want to remove this item from the cart?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => confirmRemoveFromCart(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={() => confirmRemoveFromCart(true)} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => handleConfirmDialogAction(false)}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            Are you sure you want to add this item to the cart?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleConfirmDialogAction(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmDialogAction(true)}
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="date"
                      label="Tanggal Awal"
                      placeholder="Pilih tanggal awal anda menginap"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.tanggalAwal}
                      name="tanggalAwal"
                      error={touched?.tanggalAwal && errors?.tanggalAwal}
                      helperText={touched?.tanggalAwal && errors?.tanggalAwal}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="date"
                      label="Tanggal Akhir"
                      placeholder="Pilih tanggal akhir anda menginap"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values?.tanggalAkhir}
                      name="tanggalAkhir"
                      error={touched?.tanggalAkhir && errors?.tanggalAkhir}
                      helperText={touched?.tanggalAkhir && errors?.tanggalAkhir}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Cari Kamar
                </Button>
              </Box>

              <Box mt={4}>
                {data.length > 0 ? (
                  data.map((item) => (
                    <Card key={item.id} sx={{ mb: 2 }}>
                      <CardContent style={{ position: "relative" }}>
                        <Typography variant="h6" component="div">
                          {item.jenisKamar}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jenis Bed: {item.jenisBed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jumlah Bed: {item.jumlah_bed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Kapasitas: {item.kapasitas} Orang
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Luas: {item.luas} m<sup>2</sup>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fasilitas: {item.fasilitas}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.Tarif.reduce((acc, tarif) => {
                            const tarifTanggalAwal = new Date(
                              tarif.Season.tanggal_awal
                            );
                            const tarifTanggalAkhir = new Date(
                              tarif.Season.tanggal_akhir
                            );
                            const searchTanggalAwal = new Date(
                              values.tanggalAwal
                            );
                            const searchTanggalAkhir = new Date(
                              values.tanggalAkhir
                            );

                            // Check if the selected date range falls within the specified season range
                            if (
                              searchTanggalAwal >= tarifTanggalAwal &&
                              searchTanggalAkhir <= tarifTanggalAkhir
                            ) {
                              // Check if jenis_season is not "normal"
                              if (tarif.Season.jenis_season !== "normal") {
                                const adjustedHarga =
                                  calculateAdjustedHarga(tarif);
                                // If an adjusted tariff is found, render it and stop further iteration
                                return (
                                  <div
                                    key={tarif.id}
                                    style={{
                                      fontSize: "1.5rem",
                                      position: "absolute",
                                      top: 0,
                                      right: "30px",
                                      zIndex: 1,
                                    }}
                                  >
                                    Rp. {adjustedHarga * diffDays}
                                  </div>
                                  
                                );
                              } else if (!acc) {
                                // If it's a "normal" tariff and no adjusted tariff has been found, render it
                                acc = (
                                  <div
                                    key={tarif.id}
                                    style={{
                                      fontSize: "1.5rem",
                                      position: "absolute",
                                      top: 0,
                                      right: "30px",
                                      zIndex: 1,
                                    }}
                                  >
                                    Rp. {tarif.harga * diffDays}
                                  </div>
                                );
                              }
                            }

                            return acc; // Return the accumulator (either adjusted or normal tariff) for the next iteration
                          }, null)}
                        </Typography>

                        <IconButton
                          color="primary"
                          onClick={() => addToCart(item)}
                        >
                          <AddShoppingCart />
                        </IconButton>
                      </CardContent>

                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="flex-end"
                        sx={{ position: "relative" }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                          }}
                        >
                          <Button
                            component={Link}
                            to={`/DetailKamarPage/${item.id}`}
                            variant="outlined"
                          >
                            Detail Kamar
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1">No results found.</Typography>
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  tanggalAwal: yup.string().required("Tanggal is required"),
  tanggalAkhir: yup.string().required("Tanggal is required"),
});
const initialValues = {
  tanggalAwal: "2023-12-25",
  tanggalAkhir: "2023-12-26",
  jumlahDewasa: 0,
  jumlahAnakAnak: 0
};

export default KamarAvailabilityGrup;
