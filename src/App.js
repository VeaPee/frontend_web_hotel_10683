import React from 'react';
import { Box } from "@mui/material";

import Register from './scenes/register';
import Login from './scenes/login';
import Logout from './scenes/logout';

import Kamar from "./scenes/kamar";
import Season from "./scenes/season";
import Tarif from "./scenes/tarif";
import Fasilitas from "./scenes/fasilitas";

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
                <Route path="/logout" element={<Logout />}/>
                <Route path="/kamar" element={<Kamar />} />
                <Route path="/season" element={<Season />} />
                <Route path="/tarif" element={<Tarif />} />
                <Route path="/fasilitas" element={<Fasilitas />} />
                {/* <Route path="/invoices" element={<Invoices />} /> */}
                {/* <Route path="/form" element={<Form />} /> */}
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
