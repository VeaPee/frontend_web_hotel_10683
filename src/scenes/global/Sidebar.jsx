import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import NumbersIcon from "@mui/icons-material/Numbers";
import jwt_decode from "jwt-decode";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // tambahkan state userRole

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        setUserRole(decodedToken.roleId); // set userRole dari decodedToken
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");

    // Hapus token dari local storage setelah logout
    localStorage.removeItem("token");
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Grand Atma
                </Typography>
                <Typography variant="h2" color={colors.redAccent[500]}>
                  Hotel
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* ADMIN MENU */}
            {isLoggedIn && userRole === 1 && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Data Admin
                </Typography>
                <Item
                  title="Kamar"
                  to="/kamar"
                  icon={<BedroomParentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Nomor Kamar"
                  to="/nomorKamar"
                  icon={<NumbersIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {/* SM MENU */}
            {isLoggedIn && userRole === 2 && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Data Admin
                </Typography>

                <Item
                  title="Customer"
                  to="/customer"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Season"
                  to="/season"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Tarif"
                  to="/tarif"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Fasilitas Tambahan"
                  to="/fasilitas"
                  icon={<SpaOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Transaksi
                </Typography>
                {/* 
                <Item
                  title="Pesan Kamar"
                  to="/kamaravailabilitysm"
                  icon={<BedroomParentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
              </>
            )}
            {/* CUSTOMER MENU */}
            {isLoggedIn && userRole === 6 && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Transaksi
                </Typography>

                <Item
                  title="Pesan Kamar"
                  to="/kamaravailability"
                  icon={<BedroomParentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {/* FO MENU */}
            {isLoggedIn && userRole === 3 && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Check
                </Typography>

                <Item
                  title="Check Customer"
                  to="/listreservasi"
                  icon={<FactCheckOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            {/* SM & CUSTOMER MENU */}
            {isLoggedIn && (userRole === 2 || userRole === 6) && (
              <>
                <Item
                  title="Riwayat"
                  to="/riwayattransaksi"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {/* GM & OWNER MENU */}
            {isLoggedIn && (userRole === 4 || userRole === 5) && (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Laporan
                </Typography>

                <Item
                  title="Customer Baru"
                  to="/laporanCustomer"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Pendapatan Bulanan"
                  to="/laporanPendapatan"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Jumlah Tamu"
                  to="/laporanTamu"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Top Customer"
                  to="/laporanTopCustomer"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Akun
            </Typography>

            {isLoggedIn && (
              <>
                <Item
                  title="Profile"
                  to="/profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            {!isLoggedIn && (
              <>
                <Item
                  title="Register"
                  to="/register"
                  icon={<PersonAddAltOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {isLoggedIn ? (
              <Item
                title="Logout"
                to="/logout"
                icon={<LogoutOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={handleLogout}
              />
            ) : (
              <Item
                title="Login"
                to="/login"
                icon={<LoginOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
