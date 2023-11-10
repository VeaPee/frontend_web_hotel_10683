import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography } from "@material-ui/core";

const PemesananKamarPage = () => {
  // Use the useLocation hook to get the location object
  const location = useLocation();
  console.log("Location:", location);
  const cart = location?.state?.cart || [];
  console.log("Cart:", cart);

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

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Pemesanan Kamar
      </Typography>
      {cart.map((item) => (
        <Card key={item.id} style={{ margin: "auto", marginTop: "10px" }}>
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {item.jenisKamar}
            </Typography>
            <Typography variant="body1">Jenis Bed: {item.jenisBed}</Typography>
            <Typography variant="body1">
              Jumlah Bed: {item.jumlah_bed}
            </Typography>
            {/* Add more details as needed */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PemesananKamarPage;
