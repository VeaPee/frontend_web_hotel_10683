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

import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
// import Invoices from "./scenes/invoices";
// import Form from "./scenes/form";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

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

                
                
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
