import React from "react";
import { Box } from "@mui/material";

import Register from "./scenes/register";
import Login from "./scenes/login";
import Logout from "./scenes/logout";
import Profile from "./scenes/profile";

// Update Profile

import UpdatePassword from "./scenes/cruds/passwordUpdate";

import Kamar from "./scenes/kamar";
import KamarCreate from "./scenes/cruds/kamarCreate";
import KamarUpdate from "./scenes/cruds/kamarUpdate";
import KamarAvailability from "./scenes/cruds/kamarAvailability";
import KamarAvailabilityGrup from "./scenes/cruds/kamarAvailabilityGrup";

import NomorKamar from "./scenes/nomorKamar";
import NomorKamarCreate from "./scenes/cruds/nomorKamarCreate";
import NomorKamarUpdate from "./scenes/cruds/nomorKamarUpdate";

import DetailKamarPage from "./scenes/cruds/kamarDetail"

import PemesananKamarPage from "./scenes/cruds/pemesananKamar"
import PemesananKamarPageGrup from "./scenes/cruds/pemesananKamarGrup"

import PemesananFasilitasPage from "./scenes/cruds/pemesananFasilitas"
import PemesananFasilitasPageGrup from "./scenes/cruds/pemesananFasilitasGrup"

import ResumeReservasi from "./scenes/cruds/resumeReservasi"
import ResumeReservasiGrup from "./scenes/cruds/resumeReservasiGrup"

import KonfirmasiPembayaran from "./scenes/cruds/konfirmasiPembayaran"
import KonfirmasiPembayaranGrup from "./scenes/cruds/konfirmasiPembayaranGroup"

import TandaTerima from "./scenes/cruds/tandaTerima"

import Customer from "./scenes/customer";
import CustomerCreate from "./scenes/cruds/customerCreate";
import CustomerUpdate from "./scenes/cruds/customerUpdate";

import Season from "./scenes/season";
import SeasonCreate from "./scenes/cruds/seasonCreate";
import SeasonUpdate from "./scenes/cruds/seasonUpdate";

import Tarif from "./scenes/tarif";
import TarifCreate from "./scenes/cruds/tarifCreate";
import TarifUpdate from "./scenes/cruds/tarifUpdate";

import Fasilitas from "./scenes/fasilitas";
import FasilitasCreate from "./scenes/cruds/fasilitasCreate";
import FasilitasUpdate from "./scenes/cruds/fasilitasUpdate";

import RiwayatTransaksi from "./scenes/cruds/readRiwayatTransaksi";
import DetailRiwayatTransaksi from "./scenes/cruds/readDetailRiwayatTransaksi";
import ListRiwayatTransaksi from "./scenes/front_office";

import CheckIn from "./scenes/check_in";
import CheckOut from "./scenes/check_out";
import TambahinFasilitas from "./scenes/cruds/tambahinFasilitas";

import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
// import PemesananFasilitasPageGrup from "./scenes/cruds/pemesananFasilitasGrup";
// import Invoices from "./scenes/invoices";
// import Form from "./scenes/form";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  let cart = [
    { id: 1, jenisKamar: "Standard Room", jenisBed: "Single Bed", jumlah_bed: 1 },
    // Add more dummy data as needed
  ];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar setIsSidebar={setIsSidebar} />
          <main className="content" style={{ display: "flex" }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={1}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/updatepassword" element={<UpdatePassword />} />

                <Route path="/customer" element={<Customer />} />
                <Route path="/customercreate" element={<CustomerCreate />} />
                <Route path="/customerupdate/:id" element={<CustomerUpdate />} />

                <Route path="/kamar" element={<Kamar />} />
                <Route path="/kamarcreate" element={<KamarCreate />} />
                <Route path="/kamarupdate/:id" element={<KamarUpdate />} />

                <Route path="/nomorKamar" element={<NomorKamar />} />
                <Route path="/nomorkamarcreate" element={<NomorKamarCreate />} />
                <Route path="/nomorkamarUpdate/:id" element={<NomorKamarUpdate />} />

                <Route path="/KamarAvailability" element={<KamarAvailability />} />
                <Route path="/KamarAvailabilityGrup/:id" element={<KamarAvailabilityGrup />} />

                <Route path="/DetailKamarPage/:id" element={<DetailKamarPage />} />

                <Route path="/pemesananKamar" element={<PemesananKamarPage/>} />
                <Route path="/pemesananKamarGrup" element={<PemesananKamarPageGrup/>} />

                <Route path="/pemesananFasilitas" element={<PemesananFasilitasPage/>} />
                <Route path="/pemesananFasilitasGrup" element={<PemesananFasilitasPageGrup/>} />

                <Route path="/resumeReservasi/:id" element={<ResumeReservasi/>} />
                <Route path="/resumeReservasiGrup/:id" element={<ResumeReservasiGrup/>} />

                <Route path="/konfirmasiPembayaran/:id" element={<KonfirmasiPembayaran/>} />
                <Route path="/konfirmasiPembayaranGrup/:id" element={<KonfirmasiPembayaranGrup/>} />

                <Route path="/tandaTerima/:id" element={<TandaTerima/>} />
                
                <Route path="/season" element={<Season />} />
                <Route path="/seasoncreate" element={<SeasonCreate />} />
                <Route path="/seasonupdate/:id" element={<SeasonUpdate />} />

                <Route path="/tarif" element={<Tarif />} />
                <Route path="/tarifcreate" element={<TarifCreate />} />
                <Route path="/tarifupdate/:id" element={<TarifUpdate />} />

                <Route path="/fasilitas" element={<Fasilitas />} />
                <Route path="/fasilitascreate" element={<FasilitasCreate />} />
                <Route path="/fasilitasupdate/:id" element={<FasilitasUpdate />} />

                <Route path="/riwayattransaksi" element={<RiwayatTransaksi />} />
                <Route path="/detailriwayat/:id" element={<DetailRiwayatTransaksi />} />
                <Route path="/listreservasi" element={<ListRiwayatTransaksi />} />

                <Route path="/CheckIn/:id" element={<CheckIn />} />
                <Route path="/CheckOut/:id" element={<CheckOut />} />
                <Route path="/tambahinFasilitas/:id" element={<TambahinFasilitas />} />
                

              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
