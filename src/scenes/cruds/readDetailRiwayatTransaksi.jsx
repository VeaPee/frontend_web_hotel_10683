import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
// import Header from "../../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const [pegawaiThing, setPegawaiThing] = useState(0);
  const [pegawaiNama, setpegawaiNama] = useState("");

  const [customerThing, setCustomerThing] = useState(0);
  const [customerData, setCustomerData] = useState([]);

  // Value Calculation

  const totalKamar = transformedData
    .flatMap((data) => data.kamar)
    .reduce((total, kamar) => total + kamar.jumlahKamar * kamar.harga, 0);

  const totalFasilitas = transformedData
    .flatMap((data) => data.fasilitas)
    .reduce(
      (total, fasilitas) => total + fasilitas.jumlahFasilitas * fasilitas.harga,
      0
    );

  const tax = totalFasilitas * 0.1;
  const totalValue = totalFasilitas + totalKamar + tax;
  const deposit = 300000;
  const cash = totalValue - (totalKamar + deposit);

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      setIsLoading(true);

      const response = await axios.get(
        `https://p3l-10683.et.r.appspot.com/api/v1/customer/getRiwayatTransaksi/${id}`,
        config
      );

      console.log(response);
      const transformedData =
        response.data.error === false
          ? response.data.data.NotaPelunasan.map((data) => ({
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
              no_invoice: data.no_invoice,

              kamar: response.data.data.DetailReservasiKamar.map(
                (dataKamar) => ({
                  idK: dataKamar.id,
                  kamarId: dataKamar.kamarId,
                  jumlahKamar: dataKamar.jumlah,
                  subtotalKamar: dataKamar.subtotal,
                  createdAt: dataKamar.createdAt,

                  jenisKamar: dataKamar.Kamar.jenisKamar,
                  jenisBed: dataKamar.Kamar.jenisBed,

                  harga: dataKamar.Kamar.Tarif.map((tarif) => tarif.harga),
                })
              ),
              fasilitas: response.data.data.DetailReservasiFasilitas.map(
                (dataFasilitas) => ({
                  idF: dataFasilitas.id,
                  fasilitasId: dataFasilitas.fasilitasId,
                  jumlahFasilitas: dataFasilitas.jumlah,
                  subtotalFasilitas: dataFasilitas.subtotal,
                  createdAt: dataFasilitas.createdAt,
                  nama_fasilitas:
                    dataFasilitas.FasilitasTambahan.nama_fasilitas,
                  harga: dataFasilitas.FasilitasTambahan.harga,
                })
              ),
            }))
          : [];
      console.log(transformedData);
      setTransformedData(transformedData);

      //   SET ID
      if (transformedData.length > 0) {
        setPegawaiThing(transformedData[0].pegawaiId);
        setCustomerThing(transformedData[0].customerId);
      }

      //   PEGAWAI
      const responsePegawai = await axios.get(
        `https://p3l-10683.et.r.appspot.com/api/v1/customer/getPegawaiByID/${pegawaiThing}`,
        config
      );

      console.log(pegawaiThing);
      const pegawaiNama = responsePegawai.data.data.pegawai;

      console.log(responsePegawai);
      console.log(pegawaiNama);
      setpegawaiNama(pegawaiNama.nama);

      //   CUSTOMER
      const responseCustomer = await axios.get(
        `https://p3l-10683.et.r.appspot.com/api/v1/customer/getCustomerByID/${customerThing}`,
        config
      );

      console.log(customerThing);
      console.log(responseCustomer);

      const customer = responseCustomer.data.data.customer;

      const customerData = customer
        ? [
            {
              id: customer.id,
              jenis_customer: customer.jenis_customer,
              nama_customer: customer.nama_customer,
              nama_institusi: customer.nama_institusi,
              nomor_identitas: customer.nomor_identitas,
              nomor_telepon: customer.nomor_telepon,
              email: customer.email,
              alamat: customer.alamat,
            },
          ]
        : [];

      console.log(customerData);
      setCustomerData(customerData);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
  }, [token, pegawaiThing, customerThing]);

  return (
    <Box
      m="20px"
      mt="200px"
      sx={{
        width: "500px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <img alt="profile-user" src={`../../assets/GAH_Logo.jpg`} />
      </Box>

      <Box sx={{ textAlign: "center", m: 1 }}>
        Jl. P. Mangkubumi No.18, Yogyakarta 55233{" "}
      </Box>
      <Box sx={{ textAlign: "center", m: 1 }}>Telp. (0274) 487711.</Box>

      <Divider sx={{ my: 1, border: "1px solid black" }} />
      <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>INVOICE</Box>
      <Divider sx={{ my: 1, border: "1px solid black" }} />

      <form>
        <Box
          display="grid"
          gap="1px"
          mt="10px"
          sx={{
            gridTemplateAreas: `"sidebar4 header header sidebar1"
                "sidebar5 main . sidebar2"
                "sidebar6 footer footer sidebar3"`,
          }}
        >
          {!isLoading && transformedData.length > 0 ? (
            <>
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Tanggal Reservasi"
                value={new Date(
                  transformedData[0].tanggal_reservasi
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                name="tanggal_reservasi"
                sx={{
                  gridColumn: "span 1",
                  gridArea: "sidebar1",
                  "& .MuiInputBase-root": {
                    backgroundColor: "transparent",
                  },
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="No. Invoice"
                value={transformedData[0].no_invoice}
                name="no_invoice"
                sx={{
                  gridColumn: "span 2",
                  gridArea: "sidebar2",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Front Office"
                value={pegawaiNama ?? ""}
                name="front_office"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar3",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="ID Booking"
                value={`${transformedData[0].prefix_reservasi}${id}`}
                name="check_in"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar4",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Nama"
                value={customerData[0]?.nama_customer ?? ""}
                name="nama"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar5",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Alamat"
                value={customerData[0]?.alamat ?? ""}
                name="alamat"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar6",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>DETAIL</Box>
        <Divider sx={{ my: 1, border: "1px solid black" }} />

        <Box
          display="grid"
          gap="1px"
          mt="10px"
          sx={{
            gridTemplateAreas: `"header header header sidebar1"
                ". main . sidebar2"
                ". footer footer sidebar3"
                "sidebar4 . . ."
                "sidebar5 . . ."
                "sidebar6 . . ."`,
          }}
        >
          {!isLoading && transformedData.length > 0 ? (
            <>
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Check In"
                value={new Date(transformedData[0].check_in).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
                name="check_in"
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Check Out"
                value={new Date(
                  transformedData[0].check_out
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                name="check_out"
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Jumlah Dewasa"
                value={transformedData[0].jumlahDewasa}
                name="jumlahDewasa"
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Jumlah Anak Anak"
                value={transformedData[0].jumlahAnakAnak}
                name="jumlahAnakAnak"
                sx={{ gridColumn: "span 3" }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>KAMAR</Box>
        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box>
          {!isLoading && transformedData.length > 0 ? (
            <div>
              <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ border: "1px solid black" }}>
                      Jenis Kamar
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Bed
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Jumlah
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Harga
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transformedData.map((data, index) =>
                    data.kamar.map((kamar, kamarIndex) => (
                      <TableRow key={`${index}-${kamarIndex}`}>
                        <TableCell style={{ border: "1px solid black" }}>
                          {kamar.jenisKamar}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {kamar.jenisBed}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {kamar.jumlahKamar}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {"Rp." + kamar.harga}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {"Rp." + kamar.jumlahKamar * kamar.harga}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow>
                    <TableCell
                      style={{ border: "1px solid black" }}
                      colSpan={4}
                      align="center"
                    ></TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      {"Rp." +
                        transformedData
                          .flatMap((data) => data.kamar)
                          .reduce(
                            (total, kamar) =>
                              total + kamar.jumlahKamar * kamar.harga,
                            0
                          )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        <Divider sx={{ my: 1, border: "1px solid black" }} />
        <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>
          LAYANAN
        </Box>
        <Divider sx={{ my: 1, border: "1px solid black" }} />

        <Box>
          {!isLoading && transformedData.length > 0 ? (
            <div>
              <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ border: "1px solid black" }}>
                      Layanan
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Tanggal
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Jumlah
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Harga
                    </TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transformedData.map((data, index) =>
                    data.fasilitas.map((fasilitas, fasilitasIndex) => (
                      <TableRow key={`${index}-${fasilitasIndex}`}>
                        <TableCell style={{ border: "1px solid black" }}>
                          {fasilitas.nama_fasilitas}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {fasilitas.jenisBed}
                          {new Date(fasilitas.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {fasilitas.jumlahFasilitas}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {"Rp." + fasilitas.harga}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {"Rp." + fasilitas.jumlahFasilitas * fasilitas.harga}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow>
                    <TableCell
                      style={{ border: "1px solid black" }}
                      colSpan={4}
                      align="center"
                    ></TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      {"Rp." +
                        transformedData
                          .flatMap((data) => data.fasilitas)
                          .reduce(
                            (total, fasilitas) =>
                              total +
                              fasilitas.jumlahFasilitas * fasilitas.harga,
                            0
                          )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
        <Box
          display="grid"
          gap="1px"
          mt="10px"
          sx={{
            gridTemplateAreas: `"sidebar1 header header sidebar4"
                "sidebar2 main . sidebar5"
                "sidebar6 footer footer sidebar3"`,
          }}
        >
          {!isLoading && transformedData.length > 0 ? (
            <>
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Tax"
                value={"Rp." + tax}
                name="tax"
                sx={{
                  gridColumn: "span 1",
                  gridArea: "sidebar1",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="TOTAL"
                value={"Rp." + totalValue}
                name="total"
                sx={{
                  gridColumn: "span 2",
                  gridArea: "sidebar2",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Jaminan"
                value={"Rp." + totalKamar}
                name="jaminan"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar4",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Deposit"
                value={"Rp." + deposit}
                name="deposit"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar5",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />

              <TextField
                fullWidth
                variant="standard"
                type="text"
                label="Cash"
                value={"Rp." + cash}
                name="cash"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar3",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          Thank You For Your Visit!
        </Box>
      </form>
    </Box>
  );
};

export default Profile;
