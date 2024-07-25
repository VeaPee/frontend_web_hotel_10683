import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const hotelRooms = [
  {
    id: 1,
    name: "KAMAR SUPERIOR",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: "Rp. 300000 per malam",
    image:
      "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/Bata-yang-Dibiarkan-Terekspose-di-Kamar-Blackbird-Hotel-Bandung.jpg",
  },
  {
    id: 2,
    name: "KAMAR DOUBLE DELUXE",
    description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: "Rp. 350000 per malam",
    image:
      "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/japanese-bedroom.jpg",
  },
  {
    id: 3,
    name: "KAMAR EXECUTIVE DELUXE",
    description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: "Rp. 500000 per malam",
    image:
      "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/Studio-Munge-Esplanade-master-bedroom.jpg",
  },
  {
    id: 4,
    name: "Executive Suite",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: "Rp. 620000 per malam",
    image:
      "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/An-elegant-five-star-hotel-room-interior.jpg",
  },
];

//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/Bata-yang-Dibiarkan-Terekspose-di-Kamar-Blackbird-Hotel-Bandung.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/japanese-bedroom.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/bedroom-chairs.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/bkpam2235048_seakinghelicopterglamping-063-1-e1503311755353.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/simple-false-ceiling-design.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/Studio-Munge-Esplanade-master-bedroom.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/White-master-bedrooms-3.jpg
//https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/05/vidago-palace-hotel-portugal-bedroom.jpg

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard CI/CD 25/07/2024 14:18" subtitle="Welcome to Grand Atma Hotel" />
      </Box>

      {/* HOTEL ROOMS */}
      <Box mt="20px">
        {" "}
        <h2>Informasi Umum</h2>{" "}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "20px",
          }}
        >
          {" "}
          {hotelRooms.map((room) => (
            <div key={room.id}>
              {" "}
              <h3>{room.name}</h3>{" "}
              <img
                src={room.image}
                alt={room.name}
                style={{ width: "400px", height: "300px" }}
              />{" "}
              <p>{room.description}</p> <p>{room.price}</p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </Box>
    </Box>
  );
};

export default Dashboard;
