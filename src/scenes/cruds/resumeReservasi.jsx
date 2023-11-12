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
  Button,
} from "@mui/material";
// import Header from "../../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, Link, useHistory, useLocation } from "react-router-dom";

const ResumeReservasi = () => {
  const navigate = useNavigate();
  const [transformedData, setTransformedData] = useState([]);

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const [pegawaiThing, setPegawaiThing] = useState(0);
  const [pegawaiNama, setpegawaiNama] = useState("");

  const [customerThing, setCustomerThing] = useState(6);
  const [customerData, setCustomerData] = useState([]);

  const location = useLocation();
  const cart = location?.state?.cart || [];
  const tanggalAwal = location?.state?.tanggalAwal || "";
  const tanggalAkhir = location?.state?.tanggalAkhir || "";
  const calculatedHarga = location?.state?.calculatedHarga;
  const reservasiId = location?.state?.reservasiId;

//   const [subtotal, setSubtotal] = useState("");
//   const [taxTotal, setTax] = useState("");
//   const [jaminan, setJaminan] = useState("");
//   const [cashTotal, setCash] = useState("");

  console.log("tanggal awal", tanggalAwal);
  console.log(tanggalAkhir);
  const diffDays =
    (new Date(tanggalAkhir) - new Date(tanggalAwal)) / (1000 * 60 * 60 * 24);

  console.log(cart);

  console.log(calculatedHarga);
  console.log(diffDays);

  // Value Calculation

  let totalFasilitas = 0;
  let totalKamar = 0;
  // const totalKamar = transformedData
  //   .flatMap((data) => data.kamar)
  //   .reduce((total, kamar) => total + kamar.jumlahKamar * kamar.harga, 0);

  totalKamar = transformedData
    .flatMap((data) => data.kamar)
    .reduce((total, kamar) => {
      const kamarTotal = kamar.harga.reduce((acc, tarif) => {
        const tarifTanggalAwal = new Date(tarif.season.tanggal_awal);
        const tarifTanggalAkhir = new Date(tarif.season.tanggal_akhir);
        const searchTanggalAwal = new Date(transformedData[0].check_in);
        const searchTanggalAkhir = new Date(transformedData[0].check_out);

        // Check if the selected date range falls within the specified season range
        if (
          searchTanggalAwal >= tarifTanggalAwal &&
          searchTanggalAkhir <= tarifTanggalAkhir
        ) {
          // Check if jenis_season is not "normal"
          if (tarif.season.jenis_season !== "normal") {
            const adjustedHarga = calculateAdjustedHarga(tarif);

            // If an adjusted tariff is found, add it to the accumulator
            acc += kamar.jumlahKamar * adjustedHarga * diffDays;
          } else {
            // If it's a "normal" tariff, add it to the accumulator
            acc += kamar.jumlahKamar * tarif.harga * diffDays;
          }
        }

        return acc; // Return the accumulator (either adjusted or normal tariff) for the next iteration
      }, 0); // Start the reduce with an initial value of 0

      return total + kamarTotal; // Add the current kamar's total to the overall total
    }, 0); // Start the reduce with an initial value of 0

  totalFasilitas = transformedData
    ? transformedData
        .flatMap((data) => data.fasilitas || []) // Handle null or undefined fasilitas
        .reduce(
          (total, fasilitas) =>
            total + (fasilitas.jumlahFasilitas || 0) * (fasilitas.harga || 0),
          0
        )
    : 0; // Default to 0 if transformedData is null or undefined

  const calculateAdjustedHarga = (tarif) => {
    const adjustedHarga =
      tarif.harga - tarif.harga * tarif.Season.perubahan_harga;

    return adjustedHarga;
  };

  // const [calculatedHarga, setCalculatedHarga] = useState([]);
  let tax = 0;
  let totalValue = 0;
  let cash = 0;

  tax = totalFasilitas * 0.1;
  totalValue = totalFasilitas + totalKamar + tax;
  const deposit = 300000;
  cash = totalValue - (totalKamar + deposit);

  const fetchData = async (currentUserToken) => {
    try {
      const config = {
        headers: {
          Authorization: `${currentUserToken}`,
        },
      };

      setIsLoading(true);

      const response = await axios.get(
        `http://localhost:6000/api/v1/customer/getRiwayatTransaksi/${id}`,
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

                kamar: response.data.data.DetailReservasiKamar.map(
                  (dataKamar) => ({
                    idK: dataKamar.id,
                    kamarId: dataKamar.kamarId,
                    jumlahKamar: dataKamar.jumlah,
                    subtotalKamar: dataKamar.subtotal,
                    createdAt: dataKamar.createdAt,

                    jenisKamar: dataKamar.Kamar.jenisKamar,
                    jenisBed: dataKamar.Kamar.jenisBed,

                    harga: dataKamar.Kamar.Tarif.map((tarif) => ({
                      harga: tarif.harga,
                      season: tarif.Season
                        ? {
                            tanggal_awal: tarif.Season.tanggal_awal,
                            tanggal_akhir: tarif.Season.tanggal_akhir,
                            perubahan_harga: tarif.Season.perubahan_harga,
                            jenis_season: tarif.Season.jenis_season,
                            // Include other Season properties as needed
                          }
                        : null,
                    })),
                  })
                ),

                fasilitas:
                  response.data.data.DetailReservasiFasilitas.length > 0
                    ? response.data.data.DetailReservasiFasilitas.map(
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
                      )
                    : null,
              },
            ]
          : [];

      console.log(transformedData);
      console.log(transformedData.length);
      setTransformedData(transformedData);

      //   SET ID
      if (transformedData.length > 0) {
        setPegawaiThing(transformedData[0].pegawaiId);
        setCustomerThing(transformedData[0].customerId);
      }

      //   PEGAWAI
      let pegawaiNama = "";
      if (pegawaiThing) {
        const responsePegawai = await axios.get(
          `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getPegawaiByID/${pegawaiThing}`,
          config
        );

        console.log(pegawaiThing);
        pegawaiNama = responsePegawai.data.data?.pegawai?.nama;

        console.log(responsePegawai);
        console.log(pegawaiNama);
      }
      setpegawaiNama(pegawaiNama);

      //   CUSTOMER
      const responseCustomer = await axios.get(
        `https://backend-dot-p3l-10683.et.r.appspot.com/api/v1/customer/getCustomerByID/${customerThing}`,
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

  //   const prepareDataForAPI = () => {
  //     const postData = {
  //       subtotal: totalValue,
  //       tax: tax,
  //       jaminan: totalKamar,
  //       cash: cash,
  //       deposit: deposit,
  //       // Add other necessary fields based on your API requirements
  //     };

  //     return postData;
  //   };

  // Function to handle the post request
  const postDataToAPI = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const tax = totalFasilitas * 0.1;
      const totalValue = totalFasilitas + totalKamar + tax;
      const deposit = 300000;
      const cash = totalValue - (totalKamar + deposit);

      console.log("tax :",tax)
      console.log("subtotal :",totalValue)
      console.log("deposit :",deposit)
      console.log("cash :",cash)
      console.log("jaminan :",totalKamar)

      const response = await axios.post(
        `http://localhost:6000/api/v1/transaksi/konfirmasiResume/${id}`,
        {
          tax: tax,
          subtotal: totalValue,
          jaminan: totalKamar,
          cash: cash,
          deposit: deposit,
        },
        config
      );

      console.log(response.data);

      navigate(`/konfirmasiPembayaran/${reservasiId}`, {
        state: {
          cart,
          tanggalAwal,
          tanggalAkhir,
          calculatedHarga,
          reservasiId,
          totalKamar
        },
      });

      // Handle success or additional logic based on the response
    } catch (error) {
      console.error(error);
      // Handle errors or display error messages
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
      <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>RESUME</Box>
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
          {!isLoading ? (
            <>
              {transformedData.length > 0 ? (
                <>{/* Render UI with data */}</>
              ) : (
                <p>No data available.</p>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}

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
                label="ID Booking"
                value={`${transformedData[0].prefix_reservasi}`}
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
            <p></p>
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
            <p></p>
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
                    data.kamar.map((kamar, kamarIndex) => {
                      // console.log("Current kamar:", kamar); // Log the current kamar object

                      return (
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
                            {kamar.harga.reduce((acc, tarif) => {
                              const tarifTanggalAwal = new Date(
                                tarif.season.tanggal_awal
                              );
                              const tarifTanggalAkhir = new Date(
                                tarif.season.tanggal_akhir
                              );
                              const searchTanggalAwal = new Date(
                                transformedData[0].check_in
                              );
                              const searchTanggalAkhir = new Date(
                                transformedData[0].check_out
                              );

                              // Check if the selected date range falls within the specified season range
                              if (
                                searchTanggalAwal >= tarifTanggalAwal &&
                                searchTanggalAkhir <= tarifTanggalAkhir
                              ) {
                                // Check if jenis_season is not "normal"
                                if (tarif.season.jenis_season !== "normal") {
                                  const adjustedHarga =
                                    calculateAdjustedHarga(tarif);

                                  // If an adjusted tariff is found, render it and stop further iteration
                                  acc = (
                                    <div key={tarif.id}>
                                      Rp. {adjustedHarga * diffDays}
                                    </div>
                                  );
                                } else if (!acc) {
                                  // If it's a "normal" tariff and no adjusted tariff has been found, render it
                                  acc = (
                                    <div key={tarif.id}>
                                      Rp. {tarif.harga * diffDays}
                                    </div>
                                  );
                                }
                              }

                              return acc; // Return the accumulator (either adjusted or normal tariff) for the next iteration
                            }, null)}
                          </TableCell>

                          <TableCell style={{ border: "1px solid black" }}>
                            {kamar.harga.reduce((acc, tarif) => {
                              const tarifTanggalAwal = new Date(
                                tarif.season.tanggal_awal
                              );
                              const tarifTanggalAkhir = new Date(
                                tarif.season.tanggal_akhir
                              );
                              const searchTanggalAwal = new Date(
                                transformedData[0].check_in
                              );
                              const searchTanggalAkhir = new Date(
                                transformedData[0].check_out
                              );

                              // Check if the selected date range falls within the specified season range
                              if (
                                searchTanggalAwal >= tarifTanggalAwal &&
                                searchTanggalAkhir <= tarifTanggalAkhir
                              ) {
                                // Check if jenis_season is not "normal"
                                if (tarif.season.jenis_season !== "normal") {
                                  const adjustedHarga =
                                    calculateAdjustedHarga(tarif);

                                  // If an adjusted tariff is found, render it and stop further iteration
                                  acc = (
                                    <div key={tarif.id}>
                                      Rp.{" "}
                                      {kamar.jumlahKamar *
                                        adjustedHarga *
                                        diffDays}
                                    </div>
                                  );
                                } else if (!acc) {
                                  // If it's a "normal" tariff and no adjusted tariff has been found, render it
                                  acc = (
                                    <div key={tarif.id}>
                                      Rp.{" "}
                                      {kamar.jumlahKamar *
                                        tarif.harga *
                                        diffDays}
                                    </div>
                                  );
                                }
                              }

                              return acc; // Return the accumulator (either adjusted or normal tariff) for the next iteration
                            }, null)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                  <TableRow>
                    <TableCell
                      style={{ border: "1px solid black" }}
                      colSpan={4}
                      align="center"
                    ></TableCell>
                    <TableCell style={{ border: "1px solid black" }}>
                      {"Rp." + totalKamar}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p></p>
          )}
        </Box>

        <Box>
          {!isLoading &&
          transformedData.length > 0 &&
          transformedData[0]?.fasilitas?.length > 0 ? (
            <div>
              <Divider sx={{ my: 1, border: "1px solid black" }} />
              <Box sx={{ textAlign: "center", m: 1, fontWeight: "bold" }}>
                LAYANAN
              </Box>
              <Divider sx={{ my: 1, border: "1px solid black" }} />
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
            <p></p>
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
                label="Total Harga"
                value={"Rp." + totalKamar}
                name="jaminan"
                sx={{
                  gridColumn: "span 3",
                  gridArea: "sidebar4",
                }}
                InputProps={{ readOnly: true, disableUnderline: true }}
              />
            </>
          ) : (
            // Loading
            <p></p>
          )}
        </Box>

        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          Please Check Your Reservasi!
        </Box>
        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          Nomor Rekening : 770011770022
        </Box>
        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          Bank Diamond atas nama PT Atma Jaya!
        </Box>
        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          Layanan akan dibayarkan saat Check Out
        </Box>
        <Box sx={{ textAlign: "center", m: 5, fontWeight: "bold" }}>
          <Button
            onClick={() => {
                
              postDataToAPI(); // Call the postDataToAPI function on button click
              console.log(postDataToAPI())
            }}
            color="primary"
            variant="contained"
            sx={{ color: "white" }}
          >
            Konfirmasi
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ResumeReservasi;
