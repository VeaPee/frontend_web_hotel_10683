import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { IconContext } from "react-icons";
import {
  FaBed,
  FaCouch,
  FaWifi,
  FaTv,
  FaOdnoklassniki,
  FaBorderNone,
} from "react-icons/fa";

import axios from "axios";

const DetailKamarPage = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchData = (currentUserToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    };

    axios
      .get(`http://35.198.205.6:5000/api/v1/kamar/getKamarByID/${id}`, config)
      .then((response) => {
        const kamarData = response.data.data.kamar;
        setData(kamarData);
      })
      .catch((error) => {
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

  const getCurrentUserToken = () => {
    // Implement the function to retrieve the token for the current user
    // Return the token here
    return localStorage.getItem("token");
  };

  useEffect(() => {
    // Get the token for the current user from your authentication system
    const currentUserToken = getCurrentUserToken();
    setToken(currentUserToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  return (
    <div
      style={{
        maxHeight: "calc(100vh - 100px)", overflow: "auto"
        
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        style={{ marginBottom: 20, fontWeight: "bold" }}
      >
        Detail Kamar
      </Typography>

      <Card sx={{ maxWidth: 1200 }}>
        <CardMedia
          component="img"
          height="340"
          image="https://upload.wikimedia.org/wikipedia/commons/5/56/Hotel-room-renaissance-columbus-ohio.jpg"
          alt="Room Image"
        />
        <CardContent>
          {data.jenisKamar ? (
            <>
              <Typography variant="h4" component="div">
                Jenis Kamar
              </Typography>

              <Typography
                variant="h3"
                component="div"
                style={{ fontWeight: "bold" }}
              >
                {data.jenisKamar}
              </Typography>

              <Grid container spacing={2} style={{ marginTop: 10 }}>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginTop: 10 }}>
                    <IconContext.Provider
                      value={{ size: "20px", style: { marginRight: 5 } }}
                    >
                      <FaBed />
                    </IconContext.Provider>
                    <Typography variant="h5" component="span">
                      {data.jenisBed}
                    </Typography>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <IconContext.Provider
                      value={{ size: "20px", style: { marginRight: 5 } }}
                    >
                      <FaCouch />
                    </IconContext.Provider>
                    <Typography variant="h5" component="span">
                      Jumlah Bed: {data.jumlah_bed}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{ marginTop: 5 }}>
                    <IconContext.Provider
                      value={{ size: "20px", style: { marginRight: 5 } }}
                    >
                      <FaOdnoklassniki />
                    </IconContext.Provider>
                    <Typography variant="h5" component="span">
                      Kapasitas: {data.kapasitas} Orang
                    </Typography>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <IconContext.Provider
                      value={{ size: "20px", style: { marginRight: 5 } }}
                    >
                      <FaBorderNone />
                    </IconContext.Provider>
                    <Typography variant="h5" component="span">
                      Luas: {data.luas} m<sup>2</sup>
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Typography
                variant="h4"
                component="div"
                style={{ marginTop: 20 }}
              >
                Fasilitas
              </Typography>
              <ul style={{ marginTop: 10 }}>
                <li>AC</li>
                <li>Air minum kemasan gratis</li>
                <li>Brankas dalam kamar (ukuran laptop)</li>
                <li>Fasilitas membuat kopi/teh</li>
                <li>Jubah mandi</li>
                <li>Layanan kamar (24 jam)</li>
                <li>Meja tulis</li>
                <li>Minibar</li>
                <li>Pembersihan kamar harian</li>
                <li>Pengering rambut</li>
                <li>Peralatan mandi gratis</li>
                <li>Sandal</li>
                <li>Telepon</li>
                <li>Tempat tidur ekstra (biaya tambahan)</li>
                <li>Tempat tidur premium</li>
                <li>Tirai kedap-cahaya</li>
                <li>TV kabel</li>
                <li>TV LCD</li>
                <li>Wi-Fi gratis</li>
              </ul>

              {/* Additional Facilities */}
              <Typography
                variant="h4"
                component="div"
                style={{ marginTop: 20 }}
              >
                Lainnya
              </Typography>
              <ul>
                <li>Internet - WiFi Gratis</li>
                <li>
                  Hiburan - Televisi LCD dengan channel TV premium channels
                </li>
                <li>
                  Makan Minum - Pembuat kopi/teh, minibar, layanan kamar 24-jam, air minum kemasan gratis, termasuk sarapan
                </li>
                <li>
                  Untuk tidur - Seprai kualitas premium dan gorden/tirai kedap cahaya
                </li>
                <li>
                  Kamar Mandi - Kamar mandi pribadi dengan shower, jubah mandi, dan sandal
                </li>
                <li>
                  Kemudahan - Brankas (muat laptop), Meja tulis, dan Telepon;
                  tempat tidur lipat/tambahan tersedia berdasarkan permintaan
                </li>
                <li>Kenyamanan - Layanan pembenahan kamar harian</li>
                <li>Merokok/Dilarang Merokok</li>
              </ul>
            </>
          ) : (
            <Typography variant="h5">No room details found.</Typography>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          <AlertTitle>Error</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DetailKamarPage;
